import { DIContainer } from 'aos4n-core';
import { Server } from 'http';
import * as request from 'supertest';

import { Application } from '../../bin';
import { containerPromise } from './src/app';

let container: DIContainer
let server: Server
beforeAll(async function () {
    container = await containerPromise
    server = container.getComponentInstance(Application).server
})

afterAll(function () {
    server.close()
})

test('优先级顺序：类型：Action上的过滤器 > Controller上的过滤器 > 全局过滤器，位置：靠近目标 > 远离目标', async function () {
    let resp = await request(server).get('/home1/index')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('MyExceptionFilter4')
})

test('使用@ExceptionHandler指定要处理的异常类型，没有指定处理器的异常，默认使用Error异常处理器', async function () {
    {
        let resp = await request(server).get('/home2/index')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('MyExceptionFilter6_MyException')
    }

    {
        let resp = await request(server).get('/home2/index1')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('MyExceptionFilter6_Error')
    }
})

test('如果没有匹配到任何处理器，原始错误会抛出', async function () {
    {
        let resp = await request(server).get('/home3/index')
        expect(resp.status).toBe(500)
    }
})