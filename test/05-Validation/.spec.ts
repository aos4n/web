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

test('可以用在请求体类型中', async function () {
    {
        let resp = await request(server).post('/home/index1').send()
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).post('/home/index1').send({ id: 1, name: 'asd' })
        expect(resp.status).toBe(200)
    }
})

test('可以用在Action中', async function () {
    {
        let resp = await request(server).get('/home/index2')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index2?id=1')
        expect(resp.status).toBe(200)
    }
})

test('NotNull', async function () {
    {
        let resp = await request(server).get('/home/index3')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index3?id=1')
        expect(resp.status).toBe(200)
    }
})

test('NotEmpty', async function () {
    {
        let resp = await request(server).get('/home/index4')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index4?name=ok')
        expect(resp.status).toBe(200)
    }
})

test('Length', async function () {
    {
        let resp = await request(server).get('/home/index5')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index5?name=1')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index5?name=12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index5?name=   12   ')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index5?name=123')
        expect(resp.status).toBe(500)
    }
})

test('MinLength', async function () {
    {
        let resp = await request(server).get('/home/index6')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index6?name=1')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index6?name=12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index6?name=   12   ')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index6?name=123')
        expect(resp.status).toBe(200)
    }
})

test('MaxLength', async function () {
    {
        let resp = await request(server).get('/home/index7')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index7?name=1')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index7?name=12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index7?name=   12   ')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index7?name=123')
        expect(resp.status).toBe(500)
    }
})

test('Range', async function () {
    {
        let resp = await request(server).get('/home/index8')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index8?id=1')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index8?id=2')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index8?id=3')
        expect(resp.status).toBe(500)
    }
})

test('Min', async function () {
    {
        let resp = await request(server).get('/home/index9')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index9?id=1')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index9?id=2')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index9?id=3')
        expect(resp.status).toBe(200)
    }
})

test('Max', async function () {
    {
        let resp = await request(server).get('/home/index10')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index10?id=1')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index10?id=2')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index10?id=3')
        expect(resp.status).toBe(500)
    }
})

test('Decimal', async function () {
    {
        let resp = await request(server).get('/home/index11')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index11?id=1.1')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index11?id=1.12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index11?id=1.123')
        expect(resp.status).toBe(500)
    }
})

test('MinDecimal', async function () {
    {
        let resp = await request(server).get('/home/index12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index12?id=1.1')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index12?id=1.12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index12?id=1.123')
        expect(resp.status).toBe(200)
    }
})

test('MaxDecimal', async function () {
    {
        let resp = await request(server).get('/home/index13')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index13?id=1.1')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index13?id=1.12')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index13?id=1.123')
        expect(resp.status).toBe(500)
    }
})

test('Reg', async function () {
    {
        let resp = await request(server).get('/home/index14')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index14?name=a2')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index14?name=ab')
        expect(resp.status).toBe(200)
    }
})

test('自定义验证器', async function () {
    {
        let resp = await request(server).get('/home/index15')
        expect(resp.status).toBe(200)
    }
    {
        let resp = await request(server).get('/home/index15?name=abc')
        expect(resp.status).toBe(500)
    }
    {
        let resp = await request(server).get('/home/index15?name=abs')
        expect(resp.status).toBe(200)
    }
})