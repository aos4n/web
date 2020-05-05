import { DIContainer } from 'aos4n-core';
import { Server } from 'http';
import * as request from 'supertest';

import { Application } from '../../bin';
import { containerPromise } from './src/app';
import { Home1Controller } from './src/Controllers';

let container: DIContainer
let server: Server
beforeAll(async function () {
    container = await containerPromise
    server = container.getComponentInstance(Application).server
})

afterAll(function () {
    server.close()
})

test('Controller是一种特殊的组件', async function () {
    let controller = container.getComponentInstance(Home1Controller)
    expect(controller).toBeTruthy()
})

test('如果不指定path参数，将使用/ + 类名去除Controller后缀作为path', async function () {
    let resp = await request(server).get('/home2/index')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('指定path', async function () {
    let resp = await request(server).get('/h3/index')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})