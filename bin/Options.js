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
let Options = class Options {
    constructor() {
        this.port = 3000;
    }
};
__decorate([
    aos4n_core_1.Typed(),
    __metadata("design:type", Number)
], Options.prototype, "port", void 0);
Options = __decorate([
    aos4n_core_1.Config('app')
], Options);
exports.Options = Options;
//# sourceMappingURL=Options.js.map