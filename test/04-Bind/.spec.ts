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

test('BindContext', async function () {
    let resp = await request(server).get('/home/index1')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('BindRequest', async function () {
    let resp = await request(server).get('/home/index2?name=ok')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('BindResponse', async function () {
    let resp = await request(server).get('/home/index3')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('BindQuery', async function () {
    let resp = await request(server).get('/home/index4?name=ok')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('BindQuerys', async function () {
    let resp = await request(server).get('/home/index5?id=1&name=ok')
    expect(resp.status).toBe(200)
    expect(resp.body.id).toBe(1)
    expect(resp.body.name).toBe('ok')
})

test('BindPath', async function () {
    let resp = await request(server).get('/home/i6/ok')
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('BindPaths', async function () {
    let resp = await request(server).get('/home/i7/s1/1')
    expect(resp.status).toBe(200)
    expect(resp.body.school).toBe('s1')
    expect(resp.body.grade).toBe(1)
})

test('BindHeader', async function () {
    let resp = await request(server).get('/home/index8').set({ ticket: 'ok' })
    expect(resp.status).toBe(200)
    expect(resp.text).toBe('ok')
})

test('BindBody', async function () {
    let resp = await request(server).post('/home/index9').send({ id: 1, name: 'ok' })
    expect(resp.status).toBe(200)
    expect(resp.body.id).toBe(1)
    expect(resp.body.name).toBe('ok')
})