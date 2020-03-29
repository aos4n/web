"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 映射此方法为Action
 * @param type method类型，默认为GET
 */
function Mapping(type = 'GET') {
    return function (target, name) {
        Reflect.defineMetadata('$method', type.toUpperCase(), target, name);
    };
}
exports.Mapping = Mapping;
/**
 * 映射此方法为Action，允许所有类型的method
 */
function AllMapping(target, name) {
    Reflect.defineMetadata('$method', 'ALL', target, name);
}
exports.AllMapping = AllMapping;
/**
 * 映射此方法为Action，只允许GET请求
 */
function GetMapping(target, name) {
    Reflect.defineMetadata('$method', 'GET', target, name);
}
exports.GetMapping = GetMapping;
/**
 * 映射此方法为Action，只允许POST请求
 */
function PostMapping(target, name) {
    Reflect.defineMetadata('$method', 'POST', target, name);
}
exports.PostMapping = PostMapping;
/**
 * 映射此方法为Action，只允许PUT请求
 */
function PutMapping(target, name) {
    Reflect.defineMetadata('$method', 'PUT', target, name);
}
exports.PutMapping = PutMapping;
/**
 * 映射此方法为Action，只允许PATCH请求
 */
function PatchMapping(target, name) {
    Reflect.defineMetadata('$method', 'PATCH', target, name);
}
exports.PatchMapping = PatchMapping;
/**
 * 映射此方法为Action，只允许DELETE请求
 */
function DeleteMapping(target, name) {
    Reflect.defineMetadata('$method', 'DELETE', target, name);
}
exports.DeleteMapping = DeleteMapping;
/**
 * 映射此方法为Action，只允许HEAD请求
 */
function HeadMapping(target, name) {
    Reflect.defineMetadata('$method', 'HEAD', target, name);
}
exports.HeadMapping = HeadMapping;
//# sourceMappingURL=Mapping.js.map