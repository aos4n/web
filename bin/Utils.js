"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static getValidator(obj) {
        return obj != null && obj.__proto__ && Reflect.getMetadata('$validator', obj.__proto__);
    }
    /**
     * 验证模型是否合法，第一个不合法的字段会导致此方法抛出异常IllegalArgumentException
     * @param model 待验证的模型对象
     */
    static validateModel(model) {
        let validator = this.getValidator(model);
        if (!validator) {
            return;
        }
        let entries = Object.entries(validator);
        for (let entrie of entries) {
            let k = entrie[0];
            let fieldVal = model[k];
            if (fieldVal instanceof Array) {
                for (let a of fieldVal) {
                    this.validateModel(a);
                }
            }
            else {
                this.validateModel(fieldVal);
            }
            let v = entrie[1];
            let funcList = v;
            for (let func of funcList) {
                func(fieldVal);
            }
        }
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map