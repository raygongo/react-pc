import React, { Component } from 'react'
import classNames from 'classnames'
import { AppTip } from '@/components'
import { editApp, deleteApp } from '@/ajax/api'
import http from '@/ajax'
class FeatureBox extends Component {
	static defaultPops = {
		ico: null,
		mark: null,
		name: null,
		sort: null,
		url: null,
	}
	constructor(props) {
		super(props)
		this.state = {
			openTopBar: false,
			openAppTip: false,
			ico: props.ico,
			mark: props.mark,
			name: props.name,
			sort: props.sort,
			url: props.url,
		}
	}
	// 调出app应用框
	handelOpenAppTip() {
		this.setState({
			openAppTip: true
		})

	}
	componentDidMount() {

		// if(this.refs.iframe){
		// 	this.refs.iframe.onload()
		// }

	}
	iframeCompalate() {
		console.log('完成了')
	}
	/**
	 * 监听tipApp传回需要操作的 url pgeico mark name 进行操作
	 * @param {string} id 
	 */
	handelChangeApp({ url, pgeico, mark, name }) {
		console.log(url, pgeico, mark, name)
		// 判断是修改 还是删除
		if (mark !== this.state.mark) {
			http.post(editApp, {
				ar: {
					sort: this.state.sort,
					url,
					ico: pgeico,
					name,
					mark,
				},
				cn: window.CONFIG.cn,
			}).then(data => {
				this.setState({
					url,
					ico: pgeico,
					mark,
					name
				})
			})
		} else {
			http.delete(deleteApp, {
				cn: window.CONFIG.cn,
				sort: this.state.sort
			}).then(data => {
				this.setState({
					url: "",
					ico: "",
					mark: "",
					name: ""
				})
			})
		}

	}
	toggleTopBar() {
		this.setState({
			openTopBar: !this.state.openTopBar
		})
	}
	refreshIframe() {
		// this.refs.iframe.location.src = this.state.url
		if (!this.state.url) return
		this.refs.iframe.src = `${this.state.url}&cid=${this.state.mark}${window.CONFIG.user_token}`
	}
	reloadIframe(mark) {
		// this.refs.iframe.location.src = this.state.url
		if (mark == this.state.mark && !this.props.isEdit) {
			this.refs.iframe.src = `${this.state.url}&cid=${this.state.mark}${window.CONFIG.user_token}`
		}

	}
	renderContent() {
		// 编辑模式下 不显示 iframe 
		if (this.props.isEdit) {
			return (
				<div className="add-new-app">
					<span className="add-new-title" onClick={this.handelOpenAppTip.bind(this)}>
						点击{this.state.url ? "更换" : "添加"}应用
					</span>
				</div>)
		} else if (this.state.url) {
			return (<iframe ref="iframe" src={`${this.state.url}&cid=${this.state.mark}${window.CONFIG.user_token}`} onLoad={this.iframeCompalate} scrolling="no"></iframe>)
		}
	}
	render() {
		const classes = classNames({
			'control-bar': true,
			'slide-down': this.state.openTopBar
		})
		const toggleIcon = classNames({
			'iconfont': true,
			'icon-right': true,
			'toggle-bar': true,
			'arrw-rotate': this.state.openTopBar && !isEdit
		})
		let isEdit = this.props.isEdit
		return (
			<div className="feature-box">
				{
					this.props.isEdit
						? <div className="app-title">{this.state.url ? this.state.name : "未添加"}</div>
						: null
				}


				{
					isEdit
						? null
						: <div className={classes} >
							<i className="icon_refresh" onClick={this.refreshIframe.bind(this)}></i>
						</div>
				}
				{
					isEdit
						? null
						: <i className={toggleIcon} onClick={this.toggleTopBar.bind(this)}></i>
				}
				{this.renderContent()}
				{
					this.state.openAppTip
						? <AppTip
							mark={this.state.mark}
							handelChangeApp={this.handelChangeApp.bind(this)}
							handelClose={() => { this.setState({ openAppTip: false }) }} />
						: null
				}
			</div>
		)
	}
}
export default FeatureBox