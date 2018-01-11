import 'es6-promise/auto';
const defaultOption = {
    once: true
};
/** 封装对移动端接口回调函数的处理 */
export default class CallbackHandler {
    constructor(callbackName, getHash, opts = defaultOption) {
        this.callbackName = callbackName;
        this.getHash = getHash;
        this.callbackMap = {};
        this.once = true;
        CallbackHandler.registerCallback(callbackName, this.getCallback(), false);
        this.once = opts.once !== false;
    }
    /** 创建一个移动端回调处理函数，用于解析回调参数 */
    getCallback() {
        return (param) => {
            const response = param[0], key = this.getHash(response), callback = this.callbackMap[key];
            if (!callback) {
                return;
            }
            try {
                callback(response);
            }
            finally {
                this.once && this.removeCallback(key);
            }
        };
    }
    /** 注册一个回调函数 */
    addCallback(key, callback) {
        this.callbackMap[key] = callback;
    }
    /** 移除一个回调函数 */
    removeCallback(key) {
        delete this.callbackMap[key];
    }
    /** 移动端接口回调参数解析 */
    static resolveResponse(param) {
        if (typeof param === 'string') {
            return JSON.parse(decodeURIComponent(atob(param)));
        }
        else {
            return param;
        }
    }
    /** 注册一个移动端接口回调函数 */
    static registerCallback(callbackName, callback, once = true) {
        const fun = window[callbackName];
        window[callbackName] = function (response) {
            once !== false && (window[callbackName] = undefined);
            callback(CallbackHandler.resolveResponse(response));
        };
    }
    /** 注册一个移动端接口回调函数，并使用 Promise 封装响应 */
    static registerCallbackPromise(callbackName) {
        return new Promise(function (resolve, reject) {
            CallbackHandler.registerCallback(callbackName, resolve);
        });
    }
    /** 创建一个排序函数，用于对移动端接口的响应进行重新排序，使之与调用时所传的参数顺序一致 */
    static reorderBy(source, getHash) {
        return function (target) {
            const result = [];
            let item;
            while (item = target.shift()) {
                const key = getHash(item);
                //查找接口响应数组中的数据在调用参数数组中的位置
                let index = source.length;
                while (index--) {
                    if (key === getHash(source[index])) {
                        break;
                    }
                }
                if (index !== -1) {
                    result[index] = item;
                }
            }
            return result;
        };
    }
}
