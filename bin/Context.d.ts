/// <reference types="node" />
import http = require('http');
/**
 * 请求上下文，用于提供一些原生req以及res没有的属性和方法
 */
export declare class Context {
    readonly req: http.IncomingMessage;
    readonly res: http.ServerResponse;
    constructor(req: http.IncomingMessage, res: http.ServerResponse);
    private _reqBody;
    /**
     * 获取请求体，仅对POST、PUT、PATCH方法有效
     */
    get reqBody(): any;
    set reqBody(val: any);
    private _files;
    /**
     * 获取上传的文件，仅对POST、PUT、PATCH方法有效
     */
    get files(): any;
    set files(val: any);
    private _body;
    /**
     * 获取发送给客户端的响应体
     */
    get body(): any;
    /**
     * 设置发送给客户端的响应体，这会触发发送操作，将会根据响应体类型自动设置Content-Type
     */
    set body(val: any);
    private _query;
    /**
     * 获取查询参数，这是一个对象
     */
    get query(): any;
    private _state;
    /**
     * 获取请求上下文中转仓库，你可以在这个仓库存储任意内容，供不同的处理阶段使用
     */
    get state(): any;
    private send;
}
