import axios from 'axios'
// const Mock = require('mockjs')
import {
	message
} from 'antd';

import {
	baseURL,
	showErrorTip
} from '@/config'

const fetchAjax = options => {
	return new Promise((resolve, reject) => {

		const instance = axios.create({
			baseURL: baseURL,
			//设置超时时间
			timeout: 20000,
		})

		instance.defaults.headers['Content-Type'] = 'application/json'
		instance.defaults.headers['cn'] = window.CONFIG.cn

		/**
		 * 请求拦截
		 */
		instance.interceptors.request.use(config => {
			document.querySelector("#loading-box").style.display = "block"
			// if (config.method === 'post') {
			// 	config.data = Qs.stringify({
			// 		...config.data
			// 	})
			// }
			return config
		}, err => {
			return Promise.reject(err)
		})

		/**
		 * 响应拦截
		 */
		instance.interceptors.response.use(res => {
			document.querySelector("#loading-box").style.display = "none"
			// 这里保证网络连接正确
			if (res.status === 200) {
				return res.data

			} else {
				return Promise.reject()
			}

		}, err => {
			document.querySelector("#loading-box").style.display = "none"
			return Promise.reject(err)
		})
		/**
		 *  处理请求结果
		 */
		instance(options)
			.then(response => {
				if (response.state !== "CO2000") {
					// 服务器错误处理
					// 网络连接错误

					// 异常处理
					switch (response.state) {
						case "CHANGE2000":
							window.location.href = response.message
							break;
						case "NOTAUTH5000":
							showErrorTip(response.message || "没有工作台权限")
							break;
						case "OPERATION5000":
							showErrorTip(response.message || "没有该接口操作权限")
							break;
						case "US5000":
							showErrorTip(response.message || "初始化小应用失败")
							break;
						default:
							message.error("服务器出错,请稍后重试");
							break;
					}
				} else {

					resolve(response.data)
				}

			})
			.catch(err => {
				document.querySelector("#loading-box").style.display = "none"
				// 同一错误处理
				message.error('网络错误,请刷新重试')
			})
	})
}

export default {
	get(url, params = {}) {
		return fetchAjax({
			method: 'get',
			url,
			params
		})
	},

	post(url, data = {}) {
		return fetchAjax({
			method: 'post',
			url,
			data
		})
	},

	delete(url, data = {}) {
		return fetchAjax({
			method: 'delete',
			url,
			data
		})
	}
}