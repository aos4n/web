"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aos4n_core_1 = require("aos4n-core");
const ActionFilterContext_1 = require("./ActionFilterContext");
const Component_1 = require("./Component");
const Context_1 = require("./Context");
const LazyResult_1 = require("./LazyResult");
const NotFoundException_1 = require("./NotFoundException");
const Options_1 = require("./Options");
const Route_1 = require("./Route");
const Utils_1 = require("./Utils");
const formidable = require("formidable");
const http = require("http");
/**
 * web应用，这是一个启动StartUp组件，使用方法：getContainer().loadClass(Application)
 */
let Application = class Application {
    constructor(opts, container) {
        this.opts = opts;
        this.container = container;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.routeMap = new Map();
            this.build();
            this.server = http.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                res.statusCode = 404;
                let ctx = new Context_1.Context(req, res);
                let url = req.url;
                let urlArr = url.split('#')[0].split('?')[0].replace(/^\//, '').split('/');
                let controllerPath = urlArr[0] || 'home';
                let actionPath = urlArr[1] || 'index';
                let method = req.method;
                let route = (_a = this.routeMap.get(controllerPath)) === null || _a === void 0 ? void 0 : _a.get(actionPath);
                if (route != null) {
                    if (route.method == 'ALL' || route.method == method) {
                        if (new Set(['POST', 'PUT', 'PATCH']).has(method)) {
                            yield new Promise((resolve, reject) => {
                                let form = new formidable.IncomingForm();
                                form.parse(req, (err, fields, files) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    ctx.reqBody = fields;
                                    ctx.files = files;
                                    resolve();
                                });
                            });
                        }
                        route.handler(ctx);
                        return;
                    }
                }
                let bl = yield this.notFoundExceptionHandler(ctx);
                if (bl == false) {
                    res.end('Not found');
                }
            }));
            yield this.initControllers();
            yield this.initFilters();
            let port = this.opts.port;
            if (process.env.aos4nWebPort) {
                port = Number.parseInt(process.env.aos4nWebPort);
            }
            this.server.listen(port);
            let endTime = Date.now();
            let nowStr = aos4n_core_1.Utils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            console.log(`[${nowStr}] Your application has started at ${port} in ${endTime - this.container.startTime}ms`);
        });
    }
    build() {
        let controllerList = this.container.getComponentsByDecorator(Component_1.Controller);
        for (let controllerClass of controllerList) {
            this.checkControllerClass(controllerClass);
        }
    }
    checkControllerClass(_Class) {
        let controllerPath = _Class.name.replace(/Controller$/i, '').toLowerCase();
        if (this.routeMap.has(controllerPath)) {
            return;
        }
        let map = new Map();
        Object.getOwnPropertyNames(_Class.prototype).forEach(a => {
            this.checkAndHandleActionName(a, _Class, map);
        });
        if (map.size) {
            this.routeMap.set(controllerPath, map);
        }
    }
    checkAndHandleActionName(actionName, _Class, map) {
        let _prototype = _Class.prototype;
        let $method = Reflect.getMetadata('$method', _prototype, actionName);
        if (!$method) {
            return;
        }
        let route = new Route_1.Route();
        route.method = $method;
        route.handler = (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.handleContext(actionName, _Class, ctx);
            }
            catch (err) {
                let [exceptionFilter, handlerName] = this.getExceptionFilterAndHandlerName(_prototype, actionName, err.constructor);
                if (!handlerName) {
                    ctx.res.statusCode = 500;
                    ctx.res.end(err.stack || err);
                }
                try {
                    yield this.handlerException(exceptionFilter, handlerName, err, ctx);
                }
                catch (err1) {
                    ctx.res.statusCode = 500;
                    ctx.res.end(err1.stack || err1);
                }
            }
        });
        map.set(actionName.toLowerCase(), route);
    }
    getExceptionFilterAndHandlerName(_prototype, actionName, errConstructor) {
        let filtersOnController = Reflect.getMetadata('$exceptionFilters', _prototype) || [];
        let filtersOnAction = Reflect.getMetadata('$exceptionFilters', _prototype, actionName) || [];
        let filters = this.container.getComponentsByDecorator(Component_1.GlobalExceptionFilter).concat(filtersOnController, filtersOnAction).reverse();
        let [exceptionFilter, handlerName] = this.getExceptionHandlerName(errConstructor, filters);
        if (!handlerName) {
            [exceptionFilter, handlerName] = this.getExceptionHandlerName(Error, filters);
        }
        return [exceptionFilter, handlerName];
    }
    handleContext(actionName, _Class, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let _prototype = _Class.prototype;
            let instance = yield this.container.getComponentInstanceFromFactory(_prototype.constructor);
            let $params = Reflect.getMetadata('$params', _prototype, actionName) || []; //使用@Bind...注册的参数，没有使用@Bind...装饰的参数将保持为null
            let $paramTypes = Reflect.getMetadata('design:paramtypes', _prototype, actionName) || []; //全部的参数类型
            let $paramValidators = Reflect.getMetadata('$paramValidators', _prototype, actionName) || []; //全部的参数验证器
            let params = $params.map((b, idx) => {
                let originalValArr = b(ctx);
                let originalVal = originalValArr[0];
                let typeSpecified = originalValArr[1];
                let toType = $paramTypes[idx];
                if (typeSpecified && toType) {
                    return aos4n_core_1.Utils.getTypeSpecifiedValue(toType, originalVal);
                }
                else {
                    return originalVal;
                }
            });
            /**
             * 验证Action内参数
             */
            for (let i = 0; i < params.length; i++) {
                let validators = $paramValidators[i];
                if (validators == null) {
                    continue;
                }
                for (let validator of validators) {
                    validator(params[i]);
                }
            }
            /**
             * 验证Action外参数
             */
            for (let b of params) {
                Utils_1.Utils.validateModel(b);
            }
            let actionFilterContext = new ActionFilterContext_1.ActionFilterContext(ctx, params, $paramTypes, _Class, actionName);
            let filterAndInstances = yield this.getFilterAndInstances(_prototype, actionName);
            for (let [filter, filterInstance] of filterAndInstances) {
                let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(Component_1.DoBefore);
                if (!handlerName) {
                    continue;
                }
                yield filterInstance[handlerName](actionFilterContext);
                if (ctx.res.statusCode != 404) {
                    break;
                }
            }
            if (ctx.res.statusCode == 404) {
                let body = yield instance[actionName](...params);
                if (ctx.res.statusCode == 404) {
                    if (body instanceof LazyResult_1.LazyResult) {
                        ctx.state.LazyResult = body;
                    }
                    else {
                        ctx.body = body;
                    }
                }
            }
            for (let [filter, filterInstance] of filterAndInstances.reverse()) {
                let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(Component_1.DoAfter);
                if (!handlerName) {
                    continue;
                }
                yield filterInstance[handlerName](actionFilterContext);
            }
        });
    }
    getFilterAndInstances(_prototype, actionName) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtersOnController = Reflect.getMetadata('$actionFilters', _prototype) || [];
            let filtersOnAction = Reflect.getMetadata('$actionFilters', _prototype, actionName) || [];
            let globalActionFilters = this.container.getComponentsByDecorator(Component_1.GlobalActionFilter);
            let filters = globalActionFilters.concat(filtersOnController, filtersOnAction);
            let filterAndInstances = [];
            for (let filter of filters) {
                let filterInstance = yield this.container.getComponentInstanceFromFactory(filter);
                filterAndInstances.push([filter, filterInstance]);
            }
            return filterAndInstances;
        });
    }
    getExceptionHandlerName(exceptionType, filters) {
        for (let a of filters) {
            let handlerName = Reflect.getMetadata('$exceptionHandlerMap', a.prototype).get(exceptionType);
            if (handlerName) {
                return [a, handlerName];
            }
        }
        return [];
    }
    handlerException(exceptionFilter, handlerName, err, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let exceptionFilterInstance = yield this.container.getComponentInstanceFromFactory(exceptionFilter);
            yield exceptionFilterInstance[handlerName](ctx, err);
        });
    }
    initControllers() {
        return __awaiter(this, void 0, void 0, function* () {
            let controllerList = this.container.getComponentsByDecorator(Component_1.Controller);
            for (let controllerClass of controllerList) {
                yield this.container.getComponentInstanceFromFactory(controllerClass);
            }
        });
    }
    initFilters() {
        return __awaiter(this, void 0, void 0, function* () {
            let globalActionFilters = this.container.getComponentsByDecorator(Component_1.GlobalActionFilter).sort((a, b) => Reflect.getMetadata('$order', b.prototype) - Reflect.getMetadata('$order', a.prototype));
            let globalExceptionFilters = this.container.getComponentsByDecorator(Component_1.GlobalExceptionFilter);
            for (let filter of globalActionFilters) {
                yield this.container.getComponentInstanceFromFactory(filter);
            }
            for (let filter of globalExceptionFilters) {
                yield this.container.getComponentInstanceFromFactory(filter);
            }
        });
    }
    notFoundExceptionHandler(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let globalExceptionFilters = this.container.getComponentsByDecorator(Component_1.GlobalExceptionFilter);
            let [exceptionFilter, handlerName] = this.getExceptionHandlerName(NotFoundException_1.NotFoundException, globalExceptionFilters);
            if (!handlerName) {
                return false;
            }
            yield this.handlerException(exceptionFilter, handlerName, new NotFoundException_1.NotFoundException(), ctx);
            return true;
        });
    }
};
__decorate([
    aos4n_core_1.Init,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Application.prototype, "init", null);
__decorate([
    aos4n_core_1.InnerCachable({ keys: [[0, ''], [1, ''], [2, ''], [3, '']] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Array)
], Application.prototype, "getExceptionFilterAndHandlerName", null);
__decorate([
    aos4n_core_1.InnerCachable({ keys: [[0, ''], [1, ''], [2, '']] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], Application.prototype, "getFilterAndInstances", null);
Application = __decorate([
    aos4n_core_1.StartUp(),
    __metadata("design:paramtypes", [Options_1.Options, aos4n_core_1.DIContainer])
], Application);
exports.Application = Application;
//# sourceMappingURL=Application.js.map