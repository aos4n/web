import { DIContainer, Init, StartUp, Utils as CoreUtils } from 'aos4n-core';

import { ActionFilterContext } from './ActionFilterContext';
import {
    Controller, DoAfter, DoBefore, GlobalActionFilter, GlobalExceptionFilter
} from './Component';
import { LazyResult } from './LazyResult';
import { NotFoundException } from './NotFoundException';
import { Options } from './Options';
import { Utils } from './Utils';

import Koa = require('koa');
import koaBody = require('koa-body');
import koaStatic = require('koa-static');
import http = require('http');
import cors = require('koa2-cors');
import path = require('path');
import Router = require('koa-router');
/**
 * web应用，这是一个启动StartUp组件，使用方法：getContainer().loadClass(Application)
 */
@StartUp()
export class Application {
    app = new Koa()
    server: http.Server
    globalActionFilters: (new (...args: any[]) => {})[]

    constructor(private readonly opts: Options, private readonly container: DIContainer) { }

    @Init
    private async init() {
        this.build()

        let port = this.opts.port
        if (process.env.aos4nWebPort) {
            port = Number.parseInt(process.env.aos4nWebPort)
        }
        this.server = this.app.listen(port)

        await this.initControllers()
        await this.initFilters()

        let endTime = Date.now()
        let nowStr = CoreUtils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
        console.log(`[${nowStr}] Your application has started at ${port} in ${endTime - this.container.startTime}ms`)
    }

    private build() {
        if (this.opts.enableStatic) {
            let publicRootPath = path.join(CoreUtils.getAppRootPath(), 'public')
            this.app.use(koaStatic(publicRootPath))
        }

        if (this.opts.enableCors) {
            this.app.use(cors(this.opts.corsOptions))
        }

        this.app.use(koaBody(this.opts.koaBodyOptions))

        let controllerList = this.container.getComponentsByDecorator(Controller)
        for (let controllerClass of controllerList) {
            this.checkControllerClass(controllerClass)
        }

        this.app.use(async ctx => {
            await this.notFoundExceptionHandler(ctx)
        })
    }

    private checkControllerClass(_Class: new (...args: any[]) => {}) {
        let $actionMap: Map<string, { type: string, path: string }[]> = Reflect.getMetadata('$actionMap', _Class.prototype)
        if ($actionMap == null) {
            return
        }
        let controllerPath = Reflect.getMetadata('$path', _Class.prototype)
        let router = new Router({ prefix: controllerPath })
        $actionMap.forEach((v, k) => {
            let handler = this.getHandler(k, _Class)
            v.forEach(b => {
                router[b.type](b.path, handler)
            })
        })

        this.app.use(router.routes())
    }

    private getHandler(actionName: string, _Class: new (...args: any[]) => {}) {
        let _prototype = _Class.prototype
        let handler = async (ctx: Koa.Context) => {
            try {
                await this.handleContext(actionName, _Class, ctx)
            } catch (err) {
                let [exceptionFilter, handlerName] = this.getExceptionFilterAndHandlerName(_prototype, actionName, err.constructor, ctx)
                if (!handlerName) {
                    throw err
                }
                await this.handlerException(exceptionFilter, handlerName, err, ctx)
            }
        }
        return handler
    }

    private getExceptionFilterAndHandlerName(_prototype: any, actionName: string, errConstructor: any, ctx: Koa.Context): [new (...args: any[]) => {}, string] {
        let filtersOnAction = Reflect.getMetadata('$exceptionFilters', _prototype, actionName) || []
        let filtersOnController = Reflect.getMetadata('$exceptionFilters', _prototype) || []
        let globalExceptionFilters = this.container.getComponentsByDecorator(GlobalExceptionFilter)
            .filter(a => {
                let reg = Reflect.getMetadata('$match', a.prototype) as RegExp
                if (reg == null) {
                    return true
                }
                return reg.test(ctx.url)
            })
        let filters = filtersOnAction.concat(filtersOnController, globalExceptionFilters)

        let [exceptionFilter, handlerName] = this.getExceptionHandlerName(errConstructor, filters)
        if (!handlerName) {
            [exceptionFilter, handlerName] = this.getExceptionHandlerName(Error, filters)
        }

        return [exceptionFilter, handlerName]
    }

    private async handleContext(actionName: string, _Class: new (...args: any[]) => {}, ctx: Koa.Context) {
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

        let filterAndInstances = await this.getFilterAndInstances(_prototype, actionName, ctx)
        for (let [filter, filterInstance] of filterAndInstances) {
            let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(DoBefore)
            if (!handlerName) {
                continue
            }
            await filterInstance[handlerName](actionFilterContext)
            if (ctx.status != 404) {
                break
            }
        }

        if (ctx.status == 404) {
            let body = await instance[actionName](...params)
            if (ctx.status == 404) {
                if (body instanceof LazyResult) {
                    ctx.state.LazyResult = body
                } else {
                    ctx.body = body
                }
            }
        }

        for (let i = filterAndInstances.length - 1; i >= 0; i--) {
            let [filter, filterInstance] = filterAndInstances[i]
            let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(DoAfter)
            if (!handlerName) {
                continue
            }
            await filterInstance[handlerName](actionFilterContext)
        }
    }

    private async getFilterAndInstances(_prototype: any, actionName: string, ctx: Koa.Context) {
        let filtersOnAction = Reflect.getMetadata('$actionFilters', _prototype, actionName) || []
        let filtersOnController = Reflect.getMetadata('$actionFilters', _prototype) || []
        let globalActionFilters = this.globalActionFilters
            .filter(a => {
                let reg = Reflect.getMetadata('$match', a.prototype) as RegExp
                if (reg == null) {
                    return true
                }
                return reg.test(ctx.url)
            })
        let filters = filtersOnAction.concat(filtersOnController, globalActionFilters)
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

    private async handlerException(exceptionFilter: new (...args: any[]) => {}, handlerName: string, err: any, ctx: Koa.Context) {
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
        let globalActionFilters = this.container.getComponentsByDecorator(GlobalActionFilter)
        let globalExceptionFilters = this.container.getComponentsByDecorator(GlobalExceptionFilter)
        for (let filter of globalActionFilters) {
            await this.container.getComponentInstanceFromFactory(filter)
        }
        for (let filter of globalExceptionFilters) {
            await this.container.getComponentInstanceFromFactory(filter)
        }
        this.globalActionFilters = globalActionFilters.sort((a, b) => Reflect.getMetadata('$order', b.prototype) - Reflect.getMetadata('$order', a.prototype))
    }

    private async notFoundExceptionHandler(ctx: Koa.Context) {
        let globalExceptionFilters = this.container.getComponentsByDecorator(GlobalExceptionFilter)
            .filter(a => {
                let reg = Reflect.getMetadata('$match', a.prototype) as RegExp
                if (reg == null) {
                    return true
                }
                return reg.test(ctx.url)
            })
        let [exceptionFilter, handlerName] = this.getExceptionHandlerName(NotFoundException, globalExceptionFilters)
        if (!handlerName) {
            return
        }
        await this.handlerException(exceptionFilter, handlerName, new NotFoundException(), ctx)
    }
}