"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("querystring");
const parse = require("parseurl");
const stream_1 = require("stream");
/**
 * 请求上下文，用于提供一些原生req以及res没有的属性和方法
 */
class Context {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    /**
     * 获取请求体，仅对POST、PUT、PATCH方法有效
     */
    get reqBody() {
        return this._reqBody;
    }
    set reqBody(val) {
        this._reqBody = val;
    }
    /**
     * 获取上传的文件，仅对POST、PUT、PATCH方法有效
     */
    get files() {
        return this._files;
    }
    set files(val) {
        this._files = val;
    }
    /**
     * 获取发送给客户端的响应体
     */
    get body() {
        return this._body;
    }
    /**
     * 设置发送给客户端的响应体，这会触发发送操作，将会根据响应体类型自动设置Content-Type
     */
    set body(val) {
        this._body = val;
        this.send();
    }
    /**
     * 获取查询参数，这是一个对象
     */
    get query() {
        if (!this._query) {
            this._query = qs.parse(parse(this.req).query || '');
        }
        return this._query;
    }
    /**
     * 获取请求上下文中转仓库，你可以在这个仓库存储任意内容，供不同的处理阶段使用
     */
    get state() {
        if (this._state == null) {
            this._state = {};
        }
        return this._state;
    }
    send() {
        let body = this._body;
        let res = this.res;
        if (body == null) {
            res.statusCode = 204;
            return res.end();
        }
        res.statusCode = 200;
        let bodyType = typeof body;
        if (bodyType === 'string') {
            if (/^\s*</.test(body)) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
            }
            else {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }
            return res.end(body);
        }
        if (bodyType === 'object') {
            if (body instanceof Buffer) {
                return res.end(body);
            }
            if (body instanceof stream_1.Stream) {
                return body.pipe(res);
            }
        }
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(body));
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map