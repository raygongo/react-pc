export default class regCallback {
    static registerCallbackPromise(callbackName){
        return new Promise((resolve, reject) => {
            regCallback.registerCallback(callbackName, resolve);
        });
    }
    static resolveResponse(param) {
        if (typeof param === 'string') {
            return JSON.parse(window.decodeURI(param));
        }
    }
    static registerCallback(callbackName, callback) {
        window[callbackName] =  (response) => {
            callback(regCallback.resolveResponse(response));
        };
    }
}