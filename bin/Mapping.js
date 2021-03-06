"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 映射此方法为Action，一个方法允许同时使用多个Mapping标记
 * @param type method类型，默认为get
 * @param path 映射到的路由，默认为/ + action名称
 */
function Mapping(type = 'get', path = null) {
    return function (target, name) {
        let $actionMap = Reflect.getMetadata('$actionMap', target) || new Map();
        let $routes = $actionMap.get(name) || [];
        let _type = type.toLowerCase();
        let _path = '';
        if (path == null) {
            _path = '/' + name;
        }
        else {
            _path = path;
        }
        $routes.push({
            type: _type,
            path: _path
        });
        $actionMap.set(name, $routes);
        Reflect.defineMetadata('$actionMap', $actionMap, target);
    };
}
exports.Mapping = Mapping;
/**
 * 映射此方法为Action，允许所有类型的method请求
 * @param path 映射到的路由，默认为action名称
 */
function AllMapping(path = null) {
    return Mapping('all', path);
}
exports.AllMapping = AllMapping;
/**
 * 映射此方法为Action，只允许get请求
 * @param path 映射到的路由，默认为action名称
 */
function GetMapping(path = null) {
    return Mapping('get', path);
}
exports.GetMapping = GetMapping;
/**
 * 映射此方法为Action，只允许post请求
 * @param path 映射到的路由，默认为action名称
 */
function PostMapping(path = null) {
    return Mapping('post', path);
}
exports.PostMapping = PostMapping;
/**
 * 映射此方法为Action，只允许put请求
 * @param path 映射到的路由，默认为action名称
 */
function PutMapping(path = null) {
    return Mapping('put', path);
}
exports.PutMapping = PutMapping;
/**
 * 映射此方法为Action，只允许patch请求
 * @param path 映射到的路由，默认为action名称
 */
function PatchMapping(path = null) {
    return Mapping('patch', path);
}
exports.PatchMapping = PatchMapping;
/**
 * 映射此方法为Action，只允许delete请求
 * @param path 映射到的路由，默认为action名称
 */
function DeleteMapping(path = null) {
    return Mapping('delete', path);
}
exports.DeleteMapping = DeleteMapping;
/**
 * 映射此方法为Action，只允许head请求
 * @param path 映射到的路由，默认为action名称
 */
function HeadMapping(path = null) {
    return Mapping('head', path);
}
exports.HeadMapping = HeadMapping;
//# sourceMappingURL=Mapping.js.map