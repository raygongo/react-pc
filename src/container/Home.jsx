import React, { Component } from 'react'
import { FeatureBox } from '@/components'
import PropTypes from 'prop-types'
import { Button } from 'antd';
import Token from '@/mobileInterface/token'
import http from '@/ajax'
import classNames from 'classnames'
import { getHomeList, getModeList, changeMode, getAppTipList } from '@/ajax/api'
import '@/styles/home.less'

const MODE = {
	list: 'pc_list',
	grid1: 'pc_grid1',
	grid2: 'pc_grid2',

}

export default class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			apps: [],
			// 首页 当前模式下对应的数据
			openAppTip: false,
			style: "",
			tipData: [],
			showModeSelect: false,
			modeData: [],       // 所有模式数据
			isEdit: false
		}
	}

	componentDidMount() {
		/**
         * 全局对象 挂载 刷新方法
         */
		if (!window.refreshPlugin) {
			window.refreshPlugin = (params) => {
				this.refreshPlugin(JSON.parse(window.decodeURI(params)).cid)
			}
		}
		this.getHomeData()
	}
	refreshPlugin(mark) {
		// 获取最新的token
		Token.getToken().then(params => {
			window.CONFIG.user_token = params.token

			//
			for (let item in this.refs) {
				this.refs[item].reloadIframe(mark)
			}

		})
	}
	/**
	 * 获取首页数据
	 */
	getHomeData() {
		http.get(getHomeList, {
			cn: window.CONFIG.cn
		})
			.then((data) => {
				Token.getToken().then(params => {
					window.CONFIG.user_token = params.token
					this.setState({
						apps: data.apps,
						style: data.style,
						isEdit: false
					})

				})
			})
			.catch(err => {
				alert(`获取接口失败${err}`)
			})
	}
	/**
	 * 监听子组件 调出 appTip 组件
	 */
	handelOpenAppTip() {

		// 2. 第一次需要获取数据
		if (!this.state.tipData.length) {
			http.get(getAppTipList, {
				terminal: window.CONFIG.terminal,
				cn: window.CONFIG.cn
			})
				.then(data => {

					this.setState({
						tipData: data || [],
						openAppTip: true
					})

				})
		} else {
			// 1. 显示tip 
			this.setState({
				openAppTip: true
			})
		}

	}

	/**
	 * 打开模式设置
	 */
	handelOpenModeList() {
		// 发送请求 获取模式id
		http.get(getModeList, {
			terminal: 'PC'
		}).then(data => {
			this.setState({
				modeData: data,
				showModeSelect: true
			})
		})
	}
	/**
	 * 更换模式
	 */
	handelChangeMode(style) {
		http.post(changeMode, {
			cn: window.CONFIG.cn,
			style: style
		}).then(() => {
			this.setState({
				style,
				showModeSelect: false
			})
		})
	}
	renderItems() {
		return this.state.apps.map((item, index) => {
			return this.state.isEdit ? (
				<FeatureBox
					ref={index}
					index={index}
					isEdit={this.state.isEdit}
					key={`${index}`}
					{...item} />
			)
				:
				item.url ? (
					<FeatureBox
						ref={index}
						index={index}
						key={`${index}`}
						{...item} />
				)
					: null
		})
	}
	/**
	 * 切换编辑模式
	 */
	changeEdit(isEdit) {
		if (!isEdit) {
			this.getHomeData()
		} else {
			this.setState({
				isEdit: isEdit
			})
		}

	}
	render() {
		// 找出有数据中 有几个已配置的小应用
		let appCount = this.state.apps.reduce((sum, item) => {
			if (item.url) {
				return sum + 1
			} else {
				return sum + 0
			}
		}, 0)
		// 确定对应模式class
		const modeClass = classNames({
			'wrap': true,
			'single': appCount == 1 && this.state.isEdit == false,
			'double': appCount == 2 && this.state.style != MODE.grid1 && this.state.isEdit == false,
			'double-grid': appCount == 2 && this.state.style == MODE.grid1 && this.state.isEdit == false,
			'pc1': !!window.Cef,
			'grid': this.state.style == MODE.grid1 && (appCount > 1 || this.state.isEdit),
		})

		return (
			<div className={modeClass}>
				{
					this.renderItems()
				}

				{/* {
					this.state.apps.length
						? <div className="mode-setting-btn" onClick={this.handelOpenModeList.bind(this)}></div>
						: null
				} */}
				<MenuButton changeEdit={this.changeEdit.bind(this)} handelOpenModeList={this.handelOpenModeList.bind(this)} />
				{
					this.state.showModeSelect
						? <ModeChange
							modeData={this.state.modeData}
							type={this.state.style}
							handelSubmitMode={this.handelChangeMode.bind(this)}
							handelClose={() => { this.setState({ showModeSelect: false }) }} />
						: null
				}

			</div>
		)
	}
}

class MenuButton extends Component {
	constructor() {
		super()
		this.state = {
			openMenu: false
		}
	}
	changeMenu() {
		this.setState({
			openMenu: !this.state.openMenu
		})
		this.props.changeEdit(!this.state.openMenu)
	}
	render() {
		let modeClass = classNames({
			"show-change-mode": this.state.openMenu
		})
		return (
			<div className="change-mode-box">
				<CircleBtn className={modeClass} handelClick={() => { this.state.openMenu && this.props.handelOpenModeList() }}>模式设置</CircleBtn>
				<CircleBtn handelClick={this.changeMenu.bind(this)}>{this.state.openMenu ? "返回" : "编辑"}</CircleBtn>
			</div>

		)
	}
}

/**
 * CircleBtn btn
 * params  handelClick
 * params  children
 */
class CircleBtn extends Component {

	render() {
		return (
			<div className={`circle-btn ${this.props.className ? this.props.className : ""}`} onClick={this.props.handelClick}>
				<span className="circle-btn-content">{this.props.children}</span>
			</div>
		)
	}
}

class ModeChange extends Component {
	constructor(props) {
		super(props)
		this.state = {
			type: props.type
		}
	}
	changeMode(type) {
		this.setState({
			type,
		})
	}
	handelSubmitMode() {
		if (this.props.type === this.state.type) {
			this.props.handelClose()
		} else {
			this.props.handelSubmitMode(this.state.type)
		}

	}
	render() {
		return (
			<div className="mode-select-tip">
				<div className="mode-select-content">
					<div className="mode-select-title">
						<i onClick={this.props.handelClose} className="iconfont icon-delete"></i>
						模式设置
					</div>
					<ul className="mode-select-list">
						{
							this.props.modeData.map(data => (
								<li className="mode-select-item" key={data.type} onClick={this.changeMode.bind(this, data.type)}>

									<i className={data.type == MODE.list ? 'mode-item-list' : 'mode-item-grid'}></i>
									{
										data.type === this.state.type
											? <i className="mode-checked"></i>
											: null
									}
									<p>{data.detail}</p>
								</li>
							))
						}
					</ul>
					<div className="mode-select-bottom">
						<Button className="mode-selet-btn" onClick={this.handelSubmitMode.bind(this)}>确定</Button>
						<Button className="mode-selet-btn" onClick={this.props.handelClose}>取消</Button>
					</div>
				</div>
			</div>
		)
	}

}