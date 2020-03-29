/**
 * 映射此方法为Action
 * @param type method类型，默认为GET
 */
export function Mapping(type: string = 'GET') {
    return function (target: any, name: string) {
        Reflect.defineMetadata('$method', type.toUpperCase(), target, name)
    }
}

/**
 * 映射此方法为Action，允许所有类型的method
 */
export function AllMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'ALL', target, name)
}

/**
 * 映射此方法为Action，只允许GET请求
 */
export function GetMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'GET', target, name)
}

/**
 * 映射此方法为Action，只允许POST请求
 */
export function PostMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'POST', target, name)
}

/**
 * 映射此方法为Action，只允许PUT请求
 */
export function PutMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'PUT', target, name)
}

/**
 * 映射此方法为Action，只允许PATCH请求
 */
export function PatchMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'PATCH', target, name)
}

/**
 * 映射此方法为Action，只允许DELETE请求
 */
export function DeleteMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'DELETE', target, name)
}

/**
 * 映射此方法为Action，只允许HEAD请求
 */
export function HeadMapping(target: any, name: string) {
    Reflect.defineMetadata('$method', 'HEAD', target, name)
}