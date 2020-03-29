/**
 * 映射此方法为Action
 * @param type method类型，默认为GET
 */
export declare function Mapping(type?: string): (target: any, name: string) => void;
/**
 * 映射此方法为Action，允许所有类型的method
 */
export declare function AllMapping(target: any, name: string): void;
/**
 * 映射此方法为Action，只允许GET请求
 */
export declare function GetMapping(target: any, name: string): void;
/**
 * 映射此方法为Action，只允许POST请求
 */
export declare function PostMapping(target: any, name: string): void;
/**
 * 映射此方法为Action，只允许PUT请求
 */
export declare function PutMapping(target: any, name: string): void;
/**
 * 映射此方法为Action，只允许PATCH请求
 */
export declare function PatchMapping(target: any, name: string): void;
/**
 * 映射此方法为Action，只允许DELETE请求
 */
export declare function DeleteMapping(target: any, name: string): void;
/**
 * 映射此方法为Action，只允许HEAD请求
 */
export declare function HeadMapping(target: any, name: string): void;
