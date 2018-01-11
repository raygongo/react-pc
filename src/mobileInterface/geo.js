import 'es6-promise/auto';
import mi from './mobileInterface';
import CallbackHandler from './common/callbackHandler';
/** 地理位置相关操作 */
export default class Geology {
    /**
     * 获取当前坐标
     *
     * (不需要进行二次转换)
     */
    static getLocation() {
        if (mi.isAndroid) {
            const promise = CallbackHandler.registerCallbackPromise('locationRetBack').then(function (response) {
                return response[0];
            });
            mi.getLocation();
            return promise;
        }
        else {
            const promise = CallbackHandler.registerCallbackPromise('locationTRetBack').then(function (response) {
                return response[0];
            });
            mi.getLocationForIOS();
            return promise;
        }
    }
}
