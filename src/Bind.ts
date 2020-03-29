import { Context } from './Context';

function Bind(target: any, name: string, index: number, func: (ctx: Context) => [any, boolean]) {
    let $params = Reflect.getMetadata('$params', target, name) || []
    $params[index] = func
    Reflect.defineMetadata('$params', $params, target, name)
}

/**
 * 绑定Context
 * 只能在Controller中使用
 */
export function BindContext(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Context) => [ctx, false])
}

/**
 * 绑定http原生的request
 * 只能在Controller中使用
 */
export function BindRequest(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Context) => [ctx.req, false])
}

/**
 * 绑定http原生的response
 * 只能在Controller中使用
 */
export function BindResponse(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Context) => [ctx.res, false])
}

/**
 * 绑定url中的query参数
 * 只能在Controller中使用
 * @param key 参数名称
 */
export function BindQuery(key: string) {
    return function (target: any, name: string, index: number) {
        Bind(target, name, index, (ctx: Context) => [ctx.query[key], true])
    }
}

/**
 * 绑定全部的query参数为一个对象
 * 只能在Controller中使用
 */
export function BindQuerys(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Context) => [ctx.query, true])
}

/**
 * 绑定header中的参数
 * 只能在Controller中使用
 * @param key 参数名称
 */
export function BindHeader(key: string) {
    return function (target: any, name: string, index: number) {
        Bind(target, name, index, (ctx: Context) => [ctx.req.headers[key], true])
    }
}

/**
 * 只能在Controller中使用
 * 绑定请求体参数
 */
export function BindBody(target: any, name: string, index: number) {
    Bind(target, name, index, (ctx: Context) => [ctx.reqBody, true])
}