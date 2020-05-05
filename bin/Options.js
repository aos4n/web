"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const aos4n_core_1 = require("aos4n-core");
const CorsOptions_1 = require("./CorsOptions");
const KoaBodyOptions_1 = require("./KoaBodyOptions");
let Options = class Options {
    constructor() {
        this.port = 3000;
        /**
         * 是否开启静态内容支持，如果确定不需要静态内容支持，可以保持此选项关闭，可以提升性能
         * 开启后，会使用public目录作为静态文件目录
         */
        this.enableStatic = false;
        /**
         * 是否允许跨域
         */
        this.enableCors = false;
        /**
         * 跨域选项，aos4n-web使用koa2-cors这个包实现跨域，参见https://github.com/zadzbw/koa2-cors
         */
        this.corsOptions = new CorsOptions_1.CorsOptions();
        /**
         * 表单选项，aos4n-web使用koa-body这个包实现表单上传，参见https://github.com/dlau/koa-body
         */
        this.koaBodyOptions = new KoaBodyOptions_1.KoaBodyOptions();
    }
};
__decorate([
    aos4n_core_1.Typed,
    __metadata("design:type", Number)
], Options.prototype, "port", void 0);
__decorate([
    aos4n_core_1.Typed,
    __metadata("design:type", Boolean)
], Options.prototype, "enableStatic", void 0);
__decorate([
    aos4n_core_1.Typed,
    __metadata("design:type", Boolean)
], Options.prototype, "enableCors", void 0);
__decorate([
    aos4n_core_1.Typed,
    __metadata("design:type", CorsOptions_1.CorsOptions)
], Options.prototype, "corsOptions", void 0);
__decorate([
    aos4n_core_1.Typed,
    __metadata("design:type", KoaBodyOptions_1.KoaBodyOptions)
], Options.prototype, "koaBodyOptions", void 0);
Options = __decorate([
    aos4n_core_1.Config('web')
], Options);
exports.Options = Options;
//# sourceMappingURL=Options.js.map