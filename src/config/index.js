const devURL = 'http://localhost:8081/plugin-workbench/' // 开发地址
const proURL = '/plugin-workbench' // 线上地址

// 配置 线上和线下接口开发地址
export const baseURL = process.env.NODE_ENV === 'development' ? devURL : proURL

export const cancelLog = () => {
    if (process.env.NODE_ENV !== 'development') {
        window.console.log = () => {
            return
        }
    }
}

// 错误代码提示
export const showErrorTip = (msg) => {
    let errorMsgDOM = document.querySelector("#failed-data-text")
    let errorTipDOM = document.querySelector("#failed-jurisdiction")
    
    errorMsgDOM.textContent = msg
    errorTipDOM.style.display = "block"
    
}