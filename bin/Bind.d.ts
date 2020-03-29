/**
 * 绑定Context
 * 只能在Controller中使用
 */
export declare function BindContext(target: any, name: string, index: number): void;
/**
 * 绑定http原生的request
 * 只能在Controller中使用
 */
export declare function BindRequest(target: any, name: string, index: number): void;
/**
 * 绑定http原生的response
 * 只能在Controller中使用
 */
export declare function BindResponse(target: any, name: string, index: number): void;
/**
 * 绑定url中的query参数
 * 只能在Controller中使用
 * @param key 参数名称
 */
export declare function BindQuery(key: string): (target: any, name: string, index: number) => void;
/**
 * 绑定全部的query参数为一个对象
 * 只能在Controller中使用
 */
export declare function BindQuerys(target: any, name: string, index: number): void;
/**
 * 绑定header中的参数
 * 只能在Controller中使用
 * @param key 参数名称
 */
export declare function BindHeader(key: string): (target: any, name: string, index: number) => void;
/**
 * 只能在Controller中使用
 * 绑定请求体参数
 */
export declare function BindBody(target: any, name: string, index: number): void;
