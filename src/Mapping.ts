/**
 * 映射此方法为Action，一个方法允许同时使用多个Mapping标记，用于支持多种method
 * @param type method类型，默认为get
 * @param path 映射到的路由，默认为/ + action名称
 */
export function Mapping(type: string = 'get', path: string = null) {
    return function (target: any, name: string) {
        let $routes = Reflect.getMetadata('$routes', target, name) || []

        let _type = type.toLowerCase()

        let _path = ''
        if (path == null) {
            _path = '/' + name
        } else {
            _path = path
        }

        $routes.push({
            type: _type,
            path: _path
        })
        Reflect.defineMetadata('$routes', $routes, target, name)
    }
}

/**
 * 映射此方法为Action，允许所有类型的method请求
 * @param path 映射到的路由，默认为action名称
 */
export function AllMapping(path: string = null) {
    return Mapping('all', path)
}

/**
 * 映射此方法为Action，只允许get请求
 * @param path 映射到的路由，默认为action名称
 */
export function GetMapping(path: string = null) {
    return Mapping('get', path)
}

/**
 * 映射此方法为Action，只允许post请求
 * @param path 映射到的路由，默认为action名称
 */
export function PostMapping(path: string = null) {
    return Mapping('post', path)
}

/**
 * 映射此方法为Action，只允许put请求
 * @param path 映射到的路由，默认为action名称
 */
export function PutMapping(path: string = null) {
    return Mapping('put', path)
}

/**
 * 映射此方法为Action，只允许patch请求
 * @param path 映射到的路由，默认为action名称
 */
export function PatchMapping(path: string = null) {
    return Mapping('patch', path)
}

/**
 * 映射此方法为Action，只允许delete请求
 * @param path 映射到的路由，默认为action名称
 */
export function DeleteMapping(path: string = null) {
    return Mapping('delete', path)
}

/**
 * 映射此方法为Action，只允许head请求
 * @param path 映射到的路由，默认为action名称
 */
export function HeadMapping(path: string = null) {
    return Mapping('head', path)
}