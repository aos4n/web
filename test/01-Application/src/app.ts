import path = require('path');
import { getContainer } from 'aos4n-core';

import { Application } from '../../../bin/index';

let port = 3100 + Number.parseInt(path.basename(path.resolve(__dirname, '..')).match(/^\d+/)[0])
process.env.aos4nEntry = __filename
process.env.aos4nWebPort = port.toString()

export const containerPromise = getContainer().loadClass(Application).runAsync()