import { Typed, TypedArray } from 'aos4n-core';

/**
 * 跨域选项，aos4n使用koa2-cors这个包实现跨域，参见https://github.com/zadzbw/koa2-cors
 */
export class CorsOptions {
    @Typed
    origin?: string

    @TypedArray(String)
    exposeHeaders?: string[]

    @Typed
    maxAge?: number

    @Typed
    credentials?: boolean

    @TypedArray(String)
    allowMethods?: string[]

    @TypedArray(String)
    allowHeaders?: string[]
}