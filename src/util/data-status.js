;(function(root, factory) {
	if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.dataStatus = factory();
  }
}(this, function() {
/**
 * 没有数据
 * 2017年4月27日
 */
'use strict';
function dataStatus() {
	this.tid = new Date().getTime() + "-" + Math.random() * Math.pow(10, 17);
}

dataStatus.prototype = {
	show: function (params) {
		var self = this;
		var body = params.container || document.body;
		var top = params.top || '0';
		var bgColor = params.bgColor || "#f7f7f9";
		var bottom = params.bottom || '0';
		var text = params.text || '暂无数据';
		var type = params.type || 'no-data';
		var dataStatusHeight = params.height || (body.clientHeight + "px") || (window.innerHeight - top - bottom + 'px');
		var dataStatusWidth = params.width || (body.clientWidth + "px") || "100%";
		var imgHTML = null;
		var mgTop = null;

		if (params.top) {
			mgTop = -100 + params.top + 'px';
		} else {
			mgTop = '-100px';
		}

		switch (type) {
			case 'failed':
				imgHTML = '<span class="failed-data_img"></span>';
				text = '数据加载失败';
				break;
			case 'no-data':
				imgHTML = '<span class="no-data_img"></span>';
				text = '暂无数据';
				break;
			case 'loading':
				imgHTML = '<div class="spinner" ><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></span>';
				text = '加载中...';
				break;
			default:
				break;
		}


		var _data_status_node = document.createElement("div");
		var _data_status_tip_node = document.createElement("div");
		var _data_status_text_node = document.createElement("p");

		_data_status_node.setAttribute("data-status-tid", this.tid);
		_data_status_node.className = "data-status";
		_data_status_node.style.cssText = "position: absolute;" +
			"width:" + dataStatusWidth + ";" +
			"height:" + dataStatusHeight + ";" +
			"top:" + top + "px;" +
			"left:0;" +
			"overflow:hidden;" +
			"background-color:" + bgColor + ";";

		_data_status_tip_node.className = "data-status-tip";
		_data_status_tip_node.style.cssText = "position:absolute;" +
			"top:50%;" +
			"left:50%;" +
			"text-align:center;";

		_data_status_text_node.style.cssText = "font-size:15px;color:#999";
		_data_status_text_node.innerText = text;

		_data_status_tip_node.innerHTML = imgHTML;
		_data_status_tip_node.appendChild(_data_status_text_node);
		_data_status_node.appendChild(_data_status_tip_node);

		body.appendChild(_data_status_node);
		_data_status_tip_node.style.cssText += ";margin-left:-" + _data_status_tip_node.clientWidth / 2 + "px;" +
			"margin-top:-" + _data_status_tip_node.clientHeight / 2 + "px;";

		if (params && typeof (params.showCallback) == 'function') {
			params.showCallback(self);
		}
	},
	close: function (params) {
		var dataStatusDom = document.querySelector('.data-status[data-status-tid="' + this.tid + '"]');

		if (dataStatusDom && dataStatusDom.parentNode) {
			dataStatusDom.parentNode.removeChild(dataStatusDom);
			if (params && typeof (params.closeCallback) == 'function') {
				params.closeCallback();
			}
		}
	}
};

return dataStatus;
}));