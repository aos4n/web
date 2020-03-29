import { DIContainer, Init, InnerCachable, StartUp, Utils as CoreUtils } from 'aos4n-core';

import { ActionFilterContext } from './ActionFilterContext';
import {
    Controller, DoAfter, DoBefore, GlobalActionFilter, GlobalExceptionFilter
} from './Component';
import { Context } from './Context';
import { LazyResult } from './LazyResult';
import { NotFoundException } from './NotFoundException';
import { Options } from './Options';
import { Route } from './Route';
import { Utils } from './Utils';

import formidable = require('formidable');

import http = require('http');
/**
 * web应用，这是一个启动StartUp组件，使用方法：getContainer().loadClass(Application)
 */
@StartUp()
export class Application {
    server: http.Server
    private routeMap: Map<string, Map<string, Route>>

    constructor(private readonly opts: Options, private readonly container: DIContainer) { }

    @Init
    private async init() {
        this.routeMap = new Map()

        this.build()
        this.server = http.createServer(async (req, res) => {
            res.statusCode = 404
            let ctx = new Context(req, res)
            let url = req.url
            let urlArr = url.split('#')[0].split('?')[0].replace(/^\//, '').split('/')
            let controllerPath = urlArr[0] || 'home'
            let actionPath = urlArr[1] || 'index'
            let method = req.method
            let route = this.routeMap.get(controllerPath)?.get(actionPath)
            if (route != null) {
                if (route.method == 'ALL' || route.method == method) {
                    if (new Set(['POST', 'PUT', 'PATCH']).has(method)) {
                        await new Promise((resolve, reject) => {
                            let form = new formidable.IncomingForm()
                            form.parse(req, (err, fields, files) => {
                                if (err) {
                                    reject(err)
                                }
                                ctx.reqBody = fields
                                ctx.files = files
                                resolve()
                            })
                        })
                    }
                    route.handler(ctx)
                    return
                }
            }
            let bl = await this.notFoundExceptionHandler(ctx)
            if (bl == false) {
                res.end('Not found')
            }
        })

        await this.initControllers()
        await this.initFilters()

        let port = this.opts.port
        if (process.env.aos4nWebPort) {
            port = Number.parseInt(process.env.aos4nWebPort)
        }
        this.server.listen(port)

        let endTime = Date.now()
        let nowStr = CoreUtils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
        console.log(`[${nowStr}] Your application has started at ${port} in ${endTime - this.container.startTime}ms`)
    }

    private build() {
        let controllerList = this.container.getComponentsByDecorator(Controller)
        for (let controllerClass of controllerList) {
            this.checkControllerClass(controllerClass)
        }
    }

    private checkControllerClass(_Class: new (...args: any[]) => {}) {
        let controllerPath = _Class.name.replace(/Controller$/i, '').toLowerCase()
        if (this.routeMap.has(controllerPath)) {
            return
        }
        let map: Map<string, Route> = new Map()
        Object.getOwnPropertyNames(_Class.prototype).forEach(a => {
            this.checkAndHandleActionName(a, _Class, map)
        })
        if (map.size) {
            this.routeMap.set(controllerPath, map)
        }
    }

    private checkAndHandleActionName(actionName: string, _Class: new (...args: any[]) => {}, map: Map<string, Route>) {
        let _prototype = _Class.prototype
        let $method = Reflect.getMetadata('$method', _prototype, actionName)
        if (!$method) {
            return
        }
        let route = new Route()
        route.method = $method
        route.handler = async (ctx: Context) => {
            try {
                await this.handleContext(actionName, _Class, ctx)
            } catch (err) {
                let [exceptionFilter, handlerName] = this.getExceptionFilterAndHandlerName(_prototype, actionName, err.constructor)
                if (!handlerName) {
                    ctx.res.statusCode = 500
                    ctx.res.end(err.stack || err)
                }
                try {
                    await this.handlerException(exceptionFilter, handlerName, err, ctx)
                } catch (err1) {
                    ctx.res.statusCode = 500
                    ctx.res.end(err1.stack || err1)
                }
            }
        }
        map.set(actionName.toLowerCase(), route)
    }

    @InnerCachable({ keys: [[0, ''], [1, ''], [2, ''], [3, '']] })
    private getExceptionFilterAndHandlerName(_prototype: any, actionName: string, errConstructor: any): [new (...args: any[]) => {}, string] {
        let filtersOnController = Reflect.getMetadata('$exceptionFilters', _prototype) || []
        let filtersOnAction = Reflect.getMetadata('$exceptionFilters', _prototype, actionName) || []
        let filters = this.container.getComponentsByDecorator(GlobalExceptionFilter).concat(filtersOnController, filtersOnAction).reverse()

        let [exceptionFilter, handlerName] = this.getExceptionHandlerName(errConstructor, filters)
        if (!handlerName) {
            [exceptionFilter, handlerName] = this.getExceptionHandlerName(Error, filters)
        }

        return [exceptionFilter, handlerName]
    }

    private async handleContext(actionName: string, _Class: new (...args: any[]) => {}, ctx: Context) {
        let _prototype = _Class.prototype
        let instance = await this.container.getComponentInstanceFromFactory(_prototype.constructor)
        let $params = Reflect.getMetadata('$params', _prototype, actionName) || []//使用@Bind...注册的参数，没有使用@Bind...装饰的参数将保持为null
        let $paramTypes: Function[] = Reflect.getMetadata('design:paramtypes', _prototype, actionName) || []//全部的参数类型
        let $paramValidators: Function[][] = Reflect.getMetadata('$paramValidators', _prototype, actionName) || []//全部的参数验证器
        let params = $params.map((b: Function, idx: number) => {
            let originalValArr = b(ctx)
            let originalVal = originalValArr[0]
            let typeSpecified = originalValArr[1]
            let toType = $paramTypes[idx]
            if (typeSpecified && toType) {
                return CoreUtils.getTypeSpecifiedValue(toType, originalVal)
            } else {
                return originalVal
            }
        })
        /**
         * 验证Action内参数
         */
        for (let i = 0; i < params.length; i++) {
            let validators = $paramValidators[i]
            if (validators == null) {
                continue
            }
            for (let validator of validators) {
                validator(params[i])
            }
        }
        /**
         * 验证Action外参数
         */
        for (let b of params) {
            Utils.validateModel(b)
        }
        let actionFilterContext = new ActionFilterContext(ctx, params, $paramTypes, _Class, actionName)

        let filterAndInstances = await this.getFilterAndInstances(_prototype, actionName)
        for (let [filter, filterInstance] of filterAndInstances) {
            let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(DoBefore)
            if (!handlerName) {
                continue
            }
            await filterInstance[handlerName](actionFilterContext)
            if (ctx.res.statusCode != 404) {
                break
            }
        }

        if (ctx.res.statusCode == 404) {
            let body = await instance[actionName](...params)
            if (ctx.res.statusCode == 404) {
                if (body instanceof LazyResult) {
                    ctx.state.LazyResult = body
                } else {
                    ctx.body = body
                }
            }
        }

        for (let [filter, filterInstance] of filterAndInstances.reverse()) {
            let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(DoAfter)
            if (!handlerName) {
                continue
            }
            await filterInstance[handlerName](actionFilterContext)
        }
    }

    @InnerCachable({ keys: [[0, ''], [1, ''], [2, '']] })
    private async getFilterAndInstances(_prototype: any, actionName: string) {
        let filtersOnController = Reflect.getMetadata('$actionFilters', _prototype) || []
        let filtersOnAction = Reflect.getMetadata('$actionFilters', _prototype, actionName) || []
        let globalActionFilters = this.container.getComponentsByDecorator(GlobalActionFilter)
        let filters = globalActionFilters.concat(filtersOnController, filtersOnAction)
        let filterAndInstances: [new (...args: any[]) => {}, any][] = []
        for (let filter of filters) {
            let filterInstance = await this.container.getComponentInstanceFromFactory(filter)
            filterAndInstances.push([filter, filterInstance])
        }

        return filterAndInstances
    }

    private getExceptionHandlerName(exceptionType: new (...args: any[]) => {}, filters: (new (...args: any[]) => {})[]): [(new (...args: any[]) => {})?, string?] {
        for (let a of filters) {
            let handlerName = Reflect.getMetadata('$exceptionHandlerMap', a.prototype).get(exceptionType)
            if (handlerName) {
                return [a, handlerName]
            }
        }
        return []
    }

    private async handlerException(exceptionFilter: new (...args: any[]) => {}, handlerName: string, err: any, ctx: Context) {
        let exceptionFilterInstance = await this.container.getComponentInstanceFromFactory(exceptionFilter)
        await exceptionFilterInstance[handlerName](ctx, err)
    }

    private async initControllers() {
        let controllerList = this.container.getComponentsByDecorator(Controller)
        for (let controllerClass of controllerList) {
            await this.container.getComponentInstanceFromFactory(controllerClass)
        }
    }

    private async initFilters() {
        let globalActionFilters = this.container.getComponentsByDecorator(GlobalActionFilter).sort((a, b) => Reflect.getMetadata('$order', b.prototype) - Reflect.getMetadata('$order', a.prototype))
        let globalExceptionFilters = this.container.getComponentsByDecorator(GlobalExceptionFilter)
        for (let filter of globalActionFilters) {
            await this.container.getComponentInstanceFromFactory(filter)
        }
        for (let filter of globalExceptionFilters) {
            await this.container.getComponentInstanceFromFactory(filter)
        }
    }

    private async notFoundExceptionHandler(ctx: Context) {
        let globalExceptionFilters = this.container.getComponentsByDecorator(GlobalExceptionFilter)
        let [exceptionFilter, handlerName] = this.getExceptionHandlerName(NotFoundException, globalExceptionFilters)
        if (!handlerName) {
            return false
        }
        await this.handlerException(exceptionFilter, handlerName, new NotFoundException(), ctx)
        return true
    }
}