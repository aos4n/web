import Koa = require('koa');

function Bind(target: any, name: string, index: number, func: (ctx: Koa.Context) => [any, boolean]) {
    let $params = Reflect.getMetadata('$params', target, name) || []
    $params[index] = func
    Reflect.defineMetadata('$params', $params, target, name)
}

/**
 * 绑定Koa.Context
 */
export function BindContext(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Koa.Context) => [ctx, false])
}

/**
 * 绑定Koa.Request
 */
export function BindRequest(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Koa.Context) => [ctx.request, false])
}

/**
 * 绑定Koa.Response
 */
export function BindResponse(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Koa.Context) => [ctx.response, false])
}

/**
 * 绑定url中的query参数
 * @param key 参数名称
 */
export function BindQuery(key: string) {
    return function (target: any, name: string, index: number) {
        Bind(target, name, index, (ctx: Koa.Context) => [ctx.query[key], true])
    }
}

/**
 * 绑定全部的query参数为一个对象
 */
export function BindQuerys(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Koa.Context) => [ctx.query, true])
}

/**
 * 绑定url中的path参数
 * @param key 参数名称
 */
export function BindPath(key: string) {
    return function (target: any, name: string, index: number) {
        Bind(target, name, index, (ctx: Koa.Context) => [ctx.params[key], true])
    }
}

/**
 * 绑定url中全部的的path参数为一个对象
 * @param key 参数名称
 */
export function BindPaths(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Koa.Context) => [ctx.params, true])
}

/**
 * 绑定header中的参数
 * @param key 参数名称
 */
export function BindHeader(key: string) {
    return function (target: any, name: string, index: number) {
        Bind(target, name, index, (ctx: Koa.Context) => [ctx.headers[key], true])
    }
}

/**
 * 绑定请求体参数
 */
export function BindBody(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Koa.Context) => [ctx.request.body, true])
}