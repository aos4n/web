"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Bind(target, name, index, func) {
    let $params = Reflect.getMetadata('$params', target, name) || [];
    $params[index] = func;
    Reflect.defineMetadata('$params', $params, target, name);
}
/**
 * 绑定Koa.Context
 */
function BindContext(target, name, index) {
    Bind(target, name, index, (ctx) => [ctx, false]);
}
exports.BindContext = BindContext;
/**
 * 绑定Koa.Request
 */
function BindRequest(target, name, index) {
    Bind(target, name, index, (ctx) => [ctx.request, false]);
}
exports.BindRequest = BindRequest;
/**
 * 绑定Koa.Response
 */
function BindResponse(target, name, index) {
    Bind(target, name, index, (ctx) => [ctx.response, false]);
}
exports.BindResponse = BindResponse;
/**
 * 绑定url中的query参数
 * @param key 参数名称
 */
function BindQuery(key) {
    return function (target, name, index) {
        Bind(target, name, index, (ctx) => [ctx.query[key], true]);
    };
}
exports.BindQuery = BindQuery;
/**
 * 绑定全部的query参数为一个对象
 */
function BindQuerys(target, name, index) {
    Bind(target, name, index, (ctx) => [ctx.query, true]);
}
exports.BindQuerys = BindQuerys;
/**
 * 绑定url中的path参数
 * @param key 参数名称
 */
function BindPath(key) {
    return function (target, name, index) {
        Bind(target, name, index, (ctx) => [ctx.params[key], true]);
    };
}
exports.BindPath = BindPath;
/**
 * 绑定url中全部的的path参数为一个对象
 * @param key 参数名称
 */
function BindPaths(target, name, index) {
    Bind(target, name, index, (ctx) => [ctx.params, true]);
}
exports.BindPaths = BindPaths;
/**
 * 绑定header中的参数
 * @param key 参数名称
 */
function BindHeader(key) {
    return function (target, name, index) {
        Bind(target, name, index, (ctx) => [ctx.headers[key], true]);
    };
}
exports.BindHeader = BindHeader;
/**
 * 绑定请求体参数
 */
function BindBody(target, name, index) {
    Bind(target, name, index, (ctx) => [ctx.request.body, true]);
}
exports.BindBody = BindBody;
//# sourceMappingURL=Bind.js.map