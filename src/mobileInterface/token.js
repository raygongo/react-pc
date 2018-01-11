import 'es6-promise/auto';
import mi from './mobileInterface';
// import CallbackHandler from './common/callbackHandler';
import callback from './callback';
/**获取token */
export default class Token {
    
    /** 获取token */
    static getToken() {
        // const promise = CallbackHandler.registerCallbackPromise('getTokenParamsRetBack').then(function (response) {
        //     return response;
        // });
        // mi.getTokenParams();
        // return promise;

        // 1. 注册回调 接受数据
        const promise = callback.registerCallbackPromise('getTokenParamsRetBack')
        // 2. 激活客户端 对应的方法
        mi.getTokenParams();
        // 3. 返回数据
        return promise
    }
   
}
