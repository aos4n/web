import { Config, Typed } from 'aos4n-core';

import { CorsOptions } from './CorsOptions';
import { KoaBodyOptions } from './KoaBodyOptions';

@Config('web')
export class Options {
    @Typed
    port?: number = 3000

    /**
     * 是否开启静态内容支持，如果确定不需要静态内容支持，可以保持此选项关闭，可以提升性能
     * 开启后，会使用public目录作为静态文件目录
     */
    @Typed
    enableStatic?: boolean = false

    /**
     * 是否允许跨域
     */
    @Typed
    enableCors?: boolean = false

    /**
     * 跨域选项，aos4n-web使用koa2-cors这个包实现跨域，参见https://github.com/zadzbw/koa2-cors
     */
    @Typed
    corsOptions?: CorsOptions = new CorsOptions()

    /**
     * 表单选项，aos4n-web使用koa-body这个包实现表单上传，参见https://github.com/dlau/koa-body
     */
    @Typed
    koaBodyOptions: KoaBodyOptions = new KoaBodyOptions()
}