/**
 * 指定此类为控制器
 * Controller是一种特殊的Component
 */
export declare function Controller(path?: string): (target: new (...args: any[]) => {}) => void;
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
export declare function GlobalActionFilter(opts?: {
    order?: number;
    match?: RegExp;
}): (target: new (...args: any[]) => {}) => void;
/**
 * 标记此类为局部请求过滤器，除非被显式使用，否则不会生效，可以作用于Controller以及Action
 * 该过滤器优先级高于全局，一个Controller或者Action同时使用多个局部过滤器时，靠近目标的优先级更高
 * 配合UseActionFilter来使用
 */
export declare function ActionFilter(target: new (...args: any[]) => {}): void;
/**
 * 标记此类为全局异常过滤器，此类将会被aos4n自动扫描到并且应用到所有的控制器以及其Action
 * 注意，ExceptionFilter的没有，一个异常只能被一个处理器处理
 * ExceptionFilter是一种特殊的Component
 * match：正则匹配，如果指定了此参数，那么此过滤器只会针对ctx.url匹配此正则的请求生效
 */
export declare function GlobalExceptionFilter(opts?: {
    match?: RegExp;
}): (target: new (...args: any[]) => {}) => void;
/**
 * 标记此类为局部异常过滤器，除非被显式使用，否则不会生效，可以作用于Controller以及Action
 * 该过滤器优先级高于全局，一个Controller或者Action同时使用多个局部过滤器时，只会使用第一个
 * 配合UseExceptionFilter来使用
 */
export declare function ExceptionFilter(target: new (...args: any[]) => {}): void;
/**
 * 指定Controller或者一个Action使用指定的Action过滤器
 * 只能用于Controller中
 * @param actionFilter 要使用的过滤器
 */
export declare function UseActionFilter(actionFilter: new (...args: any[]) => {}): (target: any, name?: string) => void;
/**
 * 在ActionFilter标记一个方法，此方法将在Action执行前执行
 */
export declare function DoBefore(target: any, name: string): void;
/**
 * 在ActionFilter标记一个方法，此方法将在Action执行后执行
 */
export declare function DoAfter(target: any, name: string): void;
/**
 * 指定Controller或者一个Action使用指定的异常过滤器
 * 只能用于Controller中
 * @param exceptionFilter 要使用的过滤器
 */
export declare function UseExceptionFilter(exceptionFilter: new (...args: any[]) => {}): (target: any, name?: string) => void;
/**
 * 在ExceptionFilter中，标记一个方法，用于处理指定类型的异常
 * @param type 要处理的异常类型
 */
export declare function ExceptionHandler(type: new (...args: any[]) => Error | any): (target: any, name: string) => void;
