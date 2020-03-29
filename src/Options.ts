import { Config, Typed } from 'aos4n-core';

@Config('app')
export class Options {
    @Typed()
    port?: number = 3000
}