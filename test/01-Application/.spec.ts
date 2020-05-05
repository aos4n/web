import { DIContainer } from 'aos4n-core';
import { Server } from 'http';

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

test('Application是一种特殊的组件', async function () {
    let application = container.getComponentInstance(Application)
    expect(application).toBeTruthy()
})