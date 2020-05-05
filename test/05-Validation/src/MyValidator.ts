import { Func } from '../../../bin';

/**
 * 自定义验证器，参数必须包含字母s
 */
export function MyValidator() {
    return Func(a => {
        if (a == null) {
            return [true]
        }
        if (!a.includes('s')) {
            return [false, '必须包含字母s']
        }
        return [true]
    })
}