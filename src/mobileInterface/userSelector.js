import 'es6-promise/auto';
import mi from './mobileInterface';
import CallbackHandler from './common/callbackHandler';
/** 移动端用户选择器操作类 */
export default class UserSelector {
    /** 打开用户选择器 */
    static open(selected) {
        const promise = CallbackHandler.registerCallbackPromise('userSelectRetBack');
        mi.openUserSelector(selected);
        return promise;
    }
}
