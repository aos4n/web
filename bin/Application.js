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
const LazyResult_1 = require("./LazyResult");
const NotFoundException_1 = require("./NotFoundException");
const Options_1 = require("./Options");
const Utils_1 = require("./Utils");
const Koa = require("koa");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const cors = require("koa2-cors");
const path = require("path");
const Router = require("koa-router");
/**
 * web应用，这是一个启动StartUp组件，使用方法：getContainer().loadClass(Application)
 */
let Application = class Application {
    constructor(opts, container) {
        this.opts = opts;
        this.container = container;
        this.app = new Koa();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.build();
            let port = this.opts.port;
            if (process.env.aos4nWebPort) {
                port = Number.parseInt(process.env.aos4nWebPort);
            }
            this.server = this.app.listen(port);
            yield this.initControllers();
            yield this.initFilters();
            let endTime = Date.now();
            let nowStr = aos4n_core_1.Utils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            console.log(`[${nowStr}] Your application has started at ${port} in ${endTime - this.container.startTime}ms`);
        });
    }
    build() {
        if (this.opts.enableStatic) {
            let publicRootPath = path.join(aos4n_core_1.Utils.getAppRootPath(), 'public');
            this.app.use(koaStatic(publicRootPath));
        }
        if (this.opts.enableCors) {
            this.app.use(cors(this.opts.corsOptions));
        }
        this.app.use(koaBody(this.opts.koaBodyOptions));
        let controllerList = this.container.getComponentsByDecorator(Component_1.Controller);
        for (let controllerClass of controllerList) {
            this.checkControllerClass(controllerClass);
        }
        this.app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
            yield this.notFoundExceptionHandler(ctx);
        }));
    }
    checkControllerClass(_Class) {
        let $actionMap = Reflect.getMetadata('$actionMap', _Class.prototype);
        if ($actionMap == null) {
            return;
        }
        let controllerPath = Reflect.getMetadata('$path', _Class.prototype);
        let router = new Router({ prefix: controllerPath });
        $actionMap.forEach((v, k) => {
            let handler = this.getHandler(k, _Class);
            v.forEach(b => {
                router[b.type](b.path, handler);
            });
        });
        this.app.use(router.routes());
    }
    getHandler(actionName, _Class) {
        let _prototype = _Class.prototype;
        let handler = (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.handleContext(actionName, _Class, ctx);
            }
            catch (err) {
                let [exceptionFilter, handlerName] = this.getExceptionFilterAndHandlerName(_prototype, actionName, err.constructor, ctx);
                if (!handlerName) {
                    throw err;
                }
                yield this.handlerException(exceptionFilter, handlerName, err, ctx);
            }
        });
        return handler;
    }
    getExceptionFilterAndHandlerName(_prototype, actionName, errConstructor, ctx) {
        let filtersOnAction = Reflect.getMetadata('$exceptionFilters', _prototype, actionName) || [];
        let filtersOnController = Reflect.getMetadata('$exceptionFilters', _prototype) || [];
        let globalExceptionFilters = this.container.getComponentsByDecorator(Component_1.GlobalExceptionFilter)
            .filter(a => {
            let reg = Reflect.getMetadata('$match', a.prototype);
            if (reg == null) {
                return true;
            }
            return reg.test(ctx.url);
        });
        let filters = filtersOnAction.concat(filtersOnController, globalExceptionFilters);
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
            let filterAndInstances = yield this.getFilterAndInstances(_prototype, actionName, ctx);
            for (let [filter, filterInstance] of filterAndInstances) {
                let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(Component_1.DoBefore);
                if (!handlerName) {
                    continue;
                }
                yield filterInstance[handlerName](actionFilterContext);
                if (ctx.status != 404) {
                    break;
                }
            }
            if (ctx.status == 404) {
                let body = yield instance[actionName](...params);
                if (ctx.status == 404) {
                    if (body instanceof LazyResult_1.LazyResult) {
                        ctx.state.LazyResult = body;
                    }
                    else {
                        ctx.body = body;
                    }
                }
            }
            for (let i = filterAndInstances.length - 1; i >= 0; i--) {
                let [filter, filterInstance] = filterAndInstances[i];
                let handlerName = Reflect.getMetadata('$actionHandlerMap', filter.prototype).get(Component_1.DoAfter);
                if (!handlerName) {
                    continue;
                }
                yield filterInstance[handlerName](actionFilterContext);
            }
        });
    }
    getFilterAndInstances(_prototype, actionName, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtersOnAction = Reflect.getMetadata('$actionFilters', _prototype, actionName) || [];
            let filtersOnController = Reflect.getMetadata('$actionFilters', _prototype) || [];
            let globalActionFilters = this.globalActionFilters
                .filter(a => {
                let reg = Reflect.getMetadata('$match', a.prototype);
                if (reg == null) {
                    return true;
                }
                return reg.test(ctx.url);
            });
            let filters = filtersOnAction.concat(filtersOnController, globalActionFilters);
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
            let globalActionFilters = this.container.getComponentsByDecorator(Component_1.GlobalActionFilter);
            let globalExceptionFilters = this.container.getComponentsByDecorator(Component_1.GlobalExceptionFilter);
            for (let filter of globalActionFilters) {
                yield this.container.getComponentInstanceFromFactory(filter);
            }
            for (let filter of globalExceptionFilters) {
                yield this.container.getComponentInstanceFromFactory(filter);
            }
            this.globalActionFilters = globalActionFilters.sort((a, b) => Reflect.getMetadata('$order', b.prototype) - Reflect.getMetadata('$order', a.prototype));
        });
    }
    notFoundExceptionHandler(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let globalExceptionFilters = this.container.getComponentsByDecorator(Component_1.GlobalExceptionFilter)
                .filter(a => {
                let reg = Reflect.getMetadata('$match', a.prototype);
                if (reg == null) {
                    return true;
                }
                return reg.test(ctx.url);
            });
            let [exceptionFilter, handlerName] = this.getExceptionHandlerName(NotFoundException_1.NotFoundException, globalExceptionFilters);
            if (!handlerName) {
                return;
            }
            yield this.handlerException(exceptionFilter, handlerName, new NotFoundException_1.NotFoundException(), ctx);
        });
    }
};
__decorate([
    aos4n_core_1.Init,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Application.prototype, "init", null);
Application = __decorate([
    aos4n_core_1.StartUp(),
    __metadata("design:paramtypes", [Options_1.Options, aos4n_core_1.DIContainer])
], Application);
exports.Application = Application;
//# sourceMappingURL=Application.js.map