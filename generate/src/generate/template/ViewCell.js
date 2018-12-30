/**
 * 查看
 */
const vtxUtil = require('../../util/vtxUtil.js');
const indent = vtxUtil.indent;

const _dataML = Symbol('dataML');

class ViewCell {

	constructor() { 
		// Param
		this.param = '';
		// 标题
		this.title = '';
		// width
		this.width = '';
		// 缩进位数
		this.indentNum = 0;
	}

	get getParam() {
		return this.param;
	}
	set setParam(param) {
		this.param = param;
	}
	get getTitle() {
		return this.title;
	}
	set setTitle(title) {
		this.title = title;
	}
	get getWidth() {
		return this.width;
	}
	set setWidth(width) {
		this.width = width;
	}
	get getIndentNum() {
		return this.indentNum;
	}
	set setIndentNum(indentNum) {
		this.indentNum = indentNum;
	}

	// data-modallist配置项（私有方法，外部不可调用）
	[_dataML]() {
		let fragment = [
			`data-modallist={{`,
			`    layout: {type: 'ctext', name: '${this.title}', width: ${this.width}, key: '${this.param}'}`,
			`}}`
		];
		return fragment.map(item => `${indent(4)}${item}`);
	}

	// 标准查看模板
	get cellTemplate() {
		const _t = this;
		// 代码片段
		let fragment = [
			`<div`,
			    ...this[_dataML](),
			`>{${this.param}}</div>`,
		];
	   	return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 附件查看模板
	get uploadTemplate() {
		const _t = this;
		// 代码片段
		let fragment = [
			`<div`,
			    ...this[_dataML](),
			`>`,
			`    <VtxUpload2`,
			`        showUploadList={true}`,
			`        fileList={${this.param}}`,
			`        mode="multiple"`,
			`        action="/cloudFile/common/uploadFile"`,
			`        downLoadURL="/cloudFile/common/downloadFile?id="`,
			`        viewMode={true}`,
			`    />`,
			`</div>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}
}

module.exports = ViewCell;