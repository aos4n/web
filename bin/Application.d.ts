/// <reference types="node" />
import { DIContainer } from 'aos4n-core';
import { Options } from './Options';
import Koa = require('koa');
import http = require('http');
/**
 * web应用，这是一个启动StartUp组件，使用方法：getContainer().loadClass(Application)
 */
export declare class Application {
    private readonly opts;
    private readonly container;
    app: Koa<Koa.DefaultState, Koa.DefaultContext>;
    server: http.Server;
    globalActionFilters: (new (...args: any[]) => {})[];
    constructor(opts: Options, container: DIContainer);
    private init;
    private build;
    private checkControllerClass;
    private getHandler;
    private getExceptionFilterAndHandlerName;
    private handleContext;
    private getFilterAndInstances;
    private getExceptionHandlerName;
    private handlerException;
    private initControllers;
    private initFilters;
    private notFoundExceptionHandler;
}
