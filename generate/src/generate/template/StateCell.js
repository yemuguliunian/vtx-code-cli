/**
 * state
 */
const vtxUtil = require('../../util/vtxUtil.js');
const indent = vtxUtil.indent;

class StateCell {

	constructor() { 
		// Param
		this.param = '';
		// 标题
		this.title = '';
		// type
		this.type = '';
		// 是否最后位
		this.isLast = false;
		// 缩进位数
		this.indentNum = 0;
		// 默认值
		this.defaultValue = {
			text : `''`,
			textarea : `''`,
			select : 'undefined',
			treeSelect : `[]`,
			day : `''`,
			month : `''`,
			year : `''`,
			range : `''`,
			upload : `[]`
		}
	}

	get getParam() {
		return this.param;
	}
	set setParam(param) {
		this.param = param;
	}
	get getParam1() {
		return this.param1;
	}
	set setParam1(param1) {
		this.param1 = param1;
	}
	get getTitle() {
		return this.title;
	}
	set setTitle(title) {
		this.title = title;
	}
	get getType() {
		return this.type;
	}
	set setType(type) {
		this.type = type;
	}
	get getIsLast() {
		return this.isLast;
	}
	set setIsLast(isLast) {
		this.isLast = isLast;
	}
	get getIndentNum() {
		return this.indentNum;
	}
	set setIndentNum(indentNum) {
		this.indentNum = indentNum;
	}

	// 标准查看模板
	get cellTemplate() {
		const _t = this;
		const isN = ['range'].indexOf(_t.type) > -1;
		let fragment = [
			`${this.param} : ${this.defaultValue[this.type]}${(this.isLast && !isN)  ? '' : ','} // ${this.title}`
		];
		if(isN) {
			fragment = [
				...fragment,
				`${this.param1} : ${this.defaultValue[this.type]}${this.isLast ? '' : ','} // ${this.title}`
			]
		}
		// 代码片段
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}
}

const stateC = new StateCell();

module.exports = stateC;