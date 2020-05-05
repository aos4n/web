import { DIContainer } from 'aos4n-core';
import { Server } from 'http';
import * as request from 'supertest';

import { Application } from '../../bin';
import { containerPromise } from './src/app';
import { Home1Controller } from './src/Controllers';
import { MyActionFilter5 } from './src/MyActionFilter5';
import { MyActionFilter6 } from './src/MyActionFilter6';

let container: DIContainer
let server: Server
beforeAll(async function () {
    container = await containerPromise
    server = container.getComponentInstance(Application).server
})

afterAll(function () {
    server.close()
})

test('优先级顺序：类型：Action上的过滤器 > Controller上的过滤器 > 全局过滤器，位置：靠近目标 > 远离目标，order：高order > 低order。按优先级顺序执行所有过滤器的@BoBefore，按逆序执行所有过滤器的@DoAfter', async function () {
    let resp = await request(server).get('/home/index')
    expect(resp.status).toBe(200)
    expect(process.env._test).toBe('gecakijlbdfh')
})

test('可在过滤器直接发送数据到客户端，如果在@DoBefore发送数据给客户端后，后续的@DoBefore、action将不再执行，但是不影响@DoAfter的执行', async function () {
    let resp = await request(server).get('/home1/index')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('在DoBefore发送响应')

    let c = container.getComponentInstance(Home1Controller)
    expect(c.n).toBe(1)

    let f5 = container.getComponentInstance(MyActionFilter5)
    expect(f5.n).toBe(2)

    let f6 = container.getComponentInstance(MyActionFilter6)
    expect(f6.m).toBe(1)
    expect(f6.n).toBe(2)
})

test('全局过滤器可以指定match参数，仅仅对指定的路由生效', async function () {
    {
        let resp = await request(server).get('/home2/index')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('1')
    }

    {
        let resp = await request(server).get('/home3/index')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('null')
    }
})