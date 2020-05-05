import { CorsOptions } from './CorsOptions';
import { KoaBodyOptions } from './KoaBodyOptions';
export declare class Options {
    port?: number;
    /**
     * 是否开启静态内容支持，如果确定不需要静态内容支持，可以保持此选项关闭，可以提升性能
     * 开启后，会使用public目录作为静态文件目录
     */
    enableStatic?: boolean;
    /**
     * 是否允许跨域
     */
    enableCors?: boolean;
    /**
     * 跨域选项，aos4n-web使用koa2-cors这个包实现跨域，参见https://github.com/zadzbw/koa2-cors
     */
    corsOptions?: CorsOptions;
    /**
     * 表单选项，aos4n-web使用koa-body这个包实现表单上传，参见https://github.com/dlau/koa-body
     */
    koaBodyOptions: KoaBodyOptions;
}
