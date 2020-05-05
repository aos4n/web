/**
 * 绑定Koa.Context
 */
export declare function BindContext(target: any, name: string, index: number): void;
/**
 * 绑定Koa.Request
 */
export declare function BindRequest(target: any, name: string, index: number): void;
/**
 * 绑定Koa.Response
 */
export declare function BindResponse(target: any, name: string, index: number): void;
/**
 * 绑定url中的query参数
 * @param key 参数名称
 */
export declare function BindQuery(key: string): (target: any, name: string, index: number) => void;
/**
 * 绑定全部的query参数为一个对象
 */
export declare function BindQuerys(target: any, name: string, index: number): void;
/**
 * 绑定url中的path参数
 * @param key 参数名称
 */
export declare function BindPath(key: string): (target: any, name: string, index: number) => void;
/**
 * 绑定url中全部的的path参数为一个对象
 * @param key 参数名称
 */
export declare function BindPaths(target: any, name: string, index: number): void;
/**
 * 绑定header中的参数
 * @param key 参数名称
 */
export declare function BindHeader(key: string): (target: any, name: string, index: number) => void;
/**
 * 绑定请求体参数
 */
export declare function BindBody(target: any, name: string, index: number): void;
