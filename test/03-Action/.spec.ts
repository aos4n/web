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

test('如果不指定path参数，将使用/ + 方法名称', async function () {
    let resp = await request(server).get('/home/index1')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('指定path', async function () {
    let resp = await request(server).get('/home/i2')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('AllMapping', async function () {
    {
        let resp = await request(server).get('/home/index3')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('ok')
    }

    {
        let resp = await request(server).post('/home/index3')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('ok')
    }

    {
        let resp = await request(server).put('/home/index3')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('ok')
    }

    {
        let resp = await request(server).patch('/home/index3')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('ok')
    }

    {
        let resp = await request(server).delete('/home/index3')
        expect(resp.status).toBe(200)
        expect(resp.text).toBe('ok')
    }

    {
        let resp = await request(server).head('/home/index3')
        expect(resp.status).toBe(200)
        expect(resp.text).toBeUndefined()
    }
})

test('GetMapping', async function () {
    let resp = await request(server).get('/home/index4')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('PostMapping', async function () {
    let resp = await request(server).post('/home/index5')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('PutMapping', async function () {
    let resp = await request(server).put('/home/index6')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('PatchMapping', async function () {
    let resp = await request(server).patch('/home/index7')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('DeleteMapping', async function () {
    let resp = await request(server).delete('/home/index8')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('HeadMapping', async function () {
    let resp = await request(server).head('/home/index9')
    expect(resp.status).toBe(200)
    expect(resp.text).toBeUndefined()
})

test('支持异步方法', async function () {
    let resp = await request(server).get('/home/index10')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('支持Promise', async function () {
    let resp = await request(server).get('/home/index11')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('没有手动修改ctx，也没有任何返回值的action，将返回204', async function () {
    let resp = await request(server).get('/home/index12')
    expect(resp.status).toBe(204)
})