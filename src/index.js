import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import OpenComponent from '@/mobileInterface/openComponent'
// import {cancelLog} from '@/config'
// 取消 日志打印
// cancelLog()
/**
 * 监听 iframe 的 跳转信息   
 * {url,cid}
 */
window.addEventListener('message', function (event) {
    if (event.data.url && event.data.cid) {
        OpenComponent.open({
            url: event.data.url,
            cid: event.data.cid
        })
    }
}, false);

ReactDOM.render(<App />, document.getElementById('root'));
