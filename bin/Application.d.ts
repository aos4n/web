/// <reference types="node" />
import { DIContainer } from 'aos4n-core';
import { Options } from './Options';
import http = require('http');
/**
 * web应用，这是一个启动StartUp组件，使用方法：getContainer().loadClass(Application)
 */
export declare class Application {
    private readonly opts;
    private readonly container;
    server: http.Server;
    private routeMap;
    constructor(opts: Options, container: DIContainer);
    private init;
    private build;
    private checkControllerClass;
    private checkAndHandleActionName;
    private getExceptionFilterAndHandlerName;
    private handleContext;
    private getFilterAndInstances;
    private getExceptionHandlerName;
    private handlerException;
    private initControllers;
    private initFilters;
    private notFoundExceptionHandler;
}
