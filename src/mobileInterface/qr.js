import 'es6-promise/auto';
import mi from './mobileInterface';
import CallbackHandler from './common/callbackHandler';
/** 二维码操作 */
export default class QR {
    /** 扫描二维码 */
    static scan() {
        const promise = CallbackHandler.registerCallbackPromise('scanQRCodeRetBack').then(function (response) {
            return response[0];
        });
        mi.scanQRCode();
        return promise;
    }
}
