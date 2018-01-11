/** 调用接口 */
function doInvoke(name,options) {
    // c# 
    if (window.Cef) {
        // PC
        if (window.Cef[name]) {
            options ? window.Cef[name](options) :window.Cef[name]();
            
        } else {
            throw `接口${name}不存在！`;
        }
        
    } else if(window.external){
        // c++
        options? window.external.sendMessage(name,options) :window.external.sendMessage(name)
    } else {
        throw `接口对象不存在！`;
    }
}

export default {
    /** 获取用户的token信息 */
    getTokenParams() {
        doInvoke('getTokenParams');
    },
    openComponent(options) {
        doInvoke('openComponent', JSON.stringify(options));
    }
};