"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aos4n_core_1 = require("aos4n-core");
/**
 * 指定此类为控制器
 * Controller是一种特殊的Component
 */
function Controller(path = null) {
    return function (target) {
        let $path = '';
        if (path == null) {
            $path = '/' + target.name.replace(/Controller$/i, '');
        }
        else {
            $path = path;
        }
        Reflect.defineMetadata('$path', $path, target.prototype);
        Reflect.defineMetadata(Controller, true, target.prototype);
        aos4n_core_1.Utils.markAsComponent(target);
    };
}
exports.Controller = Controller;
/**
 * 标记此类为全局请求过滤器，此类将会被aos4n自动扫描到并且应用到所有的控制器以及其Action
 * 请求过滤器执行顺序为：
 *     1、高优先级ActionFilter.DoBefore
 *     2、低优先级ActionFilter.DoBefore
 *     3、Controller.Action
 *     4、低优先级ActionFilter.DoAfter
 *     5、高优先级ActionFilter.DoAfter
 * 任何DoBefore导致ctx.status != 404都将阻止后续步骤的执行，但是Controller.Action执行成功后后续的DoAfter都会执行
 * ActionFilter是一种特殊的Component
 * @param opts order：优先级，值越大优先级越高, match：正则匹配，如果指定了此参数，那么此过滤器只会针对ctx.url匹配此正则的请求生效
 */
function GlobalActionFilter(opts) {
    return function (target) {
        var _a;
        opts = opts || {};
        opts.order = (_a = opts.order) !== null && _a !== void 0 ? _a : 0;
        Reflect.defineMetadata(GlobalActionFilter, true, target.prototype);
        Reflect.defineMetadata('$order', opts.order, target.prototype);
        Reflect.defineMetadata('$match', opts.match, target.prototype);
        aos4n_core_1.Utils.markAsComponent(target);
    };
}
exports.GlobalActionFilter = GlobalActionFilter;
/**
 * 标记此类为局部请求过滤器，除非被显式使用，否则不会生效，可以作用于Controller以及Action
 * 该过滤器优先级高于全局，一个Controller或者Action同时使用多个局部过滤器时，靠近目标的优先级更高
 * 配合UseActionFilter来使用
 */
function ActionFilter(target) {
    Reflect.defineMetadata(ActionFilter, true, target.prototype);
    aos4n_core_1.Utils.markAsComponent(target);
}
exports.ActionFilter = ActionFilter;
/**
 * 标记此类为全局异常过滤器，此类将会被aos4n自动扫描到并且应用到所有的控制器以及其Action
 * 注意，ExceptionFilter的没有，一个异常只能被一个处理器处理
 * ExceptionFilter是一种特殊的Component
 * match：正则匹配，如果指定了此参数，那么此过滤器只会针对ctx.url匹配此正则的请求生效
 */
function GlobalExceptionFilter(opts) {
    return function (target) {
        opts = opts || {};
        Reflect.defineMetadata(GlobalExceptionFilter, true, target.prototype);
        Reflect.defineMetadata('$match', opts.match, target.prototype);
        aos4n_core_1.Utils.markAsComponent(target);
    };
}
exports.GlobalExceptionFilter = GlobalExceptionFilter;
/**
 * 标记此类为局部异常过滤器，除非被显式使用，否则不会生效，可以作用于Controller以及Action
 * 该过滤器优先级高于全局，一个Controller或者Action同时使用多个局部过滤器时，只会使用第一个
 * 配合UseExceptionFilter来使用
 */
function ExceptionFilter(target) {
    Reflect.defineMetadata(ExceptionFilter, true, target.prototype);
    aos4n_core_1.Utils.markAsComponent(target);
}
exports.ExceptionFilter = ExceptionFilter;
/**
 * 指定Controller或者一个Action使用指定的Action过滤器
 * 只能用于Controller中
 * @param actionFilter 要使用的过滤器
 */
function UseActionFilter(actionFilter) {
    return function (target, name = null) {
        if (!Reflect.getMetadata(ActionFilter, actionFilter.prototype)) {
            console.warn(`UseActionFilter只能使用ActionFilter，此actionFilter不符合要求，${actionFilter.name}将不会生效`);
            return;
        }
        if (name == null) {
            let $actionFilters = Reflect.getMetadata('$actionFilters', target.prototype) || [];
            $actionFilters.push(actionFilter);
            Reflect.defineMetadata('$actionFilters', $actionFilters, target.prototype);
        }
        else {
            let $actionFilters = Reflect.getMetadata('$actionFilters', target, name) || [];
            $actionFilters.push(actionFilter);
            Reflect.defineMetadata('$actionFilters', $actionFilters, target, name);
        }
    };
}
exports.UseActionFilter = UseActionFilter;
/**
 * 在ActionFilter标记一个方法，此方法将在Action执行前执行
 */
function DoBefore(target, name) {
    let $actionHandlerMap = Reflect.getMetadata('$actionHandlerMap', target) || new Map();
    $actionHandlerMap.set(DoBefore, name);
    Reflect.defineMetadata('$actionHandlerMap', $actionHandlerMap, target);
}
exports.DoBefore = DoBefore;
/**
 * 在ActionFilter标记一个方法，此方法将在Action执行后执行
 */
function DoAfter(target, name) {
    let $actionHandlerMap = Reflect.getMetadata('$actionHandlerMap', target) || new Map();
    $actionHandlerMap.set(DoAfter, name);
    Reflect.defineMetadata('$actionHandlerMap', $actionHandlerMap, target);
}
exports.DoAfter = DoAfter;
/**
 * 指定Controller或者一个Action使用指定的异常过滤器
 * 只能用于Controller中
 * @param exceptionFilter 要使用的过滤器
 */
function UseExceptionFilter(exceptionFilter) {
    return function (target, name = null) {
        if (!Reflect.getMetadata(ExceptionFilter, exceptionFilter.prototype)) {
            console.warn(`UseExceptionFilter只能使用ExceptionFilter，此exceptionFilter不符合要求，${exceptionFilter.name}将不会生效`);
            return;
        }
        if (name == null) {
            let $exceptionFilters = Reflect.getMetadata('$exceptionFilters', target.prototype) || [];
            $exceptionFilters.push(exceptionFilter);
            Reflect.defineMetadata('$exceptionFilters', $exceptionFilters, target.prototype);
        }
        else {
            let $exceptionFilters = Reflect.getMetadata('$exceptionFilters', target, name) || [];
            $exceptionFilters.push(exceptionFilter);
            Reflect.defineMetadata('$exceptionFilters', $exceptionFilters, target, name);
        }
    };
}
exports.UseExceptionFilter = UseExceptionFilter;
/**
 * 在ExceptionFilter中，标记一个方法，用于处理指定类型的异常
 * @param type 要处理的异常类型
 */
function ExceptionHandler(type) {
    return function (target, name) {
        let $exceptionHandlerMap = Reflect.getMetadata('$exceptionHandlerMap', target) || new Map();
        $exceptionHandlerMap.set(type, name);
        Reflect.defineMetadata('$exceptionHandlerMap', $exceptionHandlerMap, target);
    };
}
exports.ExceptionHandler = ExceptionHandler;
//# sourceMappingURL=Component.js.map