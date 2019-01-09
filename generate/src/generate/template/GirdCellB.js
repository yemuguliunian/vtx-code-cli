/**
 * gird
 */
const vtxUtil = require('../../util/vtxUtil.js');
const indent = vtxUtil.indent;

class GirdCellB {

	constructor() { 
		// 类型
		this.type = '';
		// 标题
		this.title = '';
		// Param
		this.param = '';
		// Param1
		this.param1 = '';
		// Param数据源
		this.paramData = '';
		// 缩进位数
		this.indentNum = 4;
	}

	get getType() {
		return this.type;
	}
	set setType(type) {
		this.type = type;
	}
	get getTitle() {
		return this.title;
	}
	set setTitle(title) {
		this.title = title;
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
	get getParamData() {
		return this.paramData;
	}
	set setParamData(paramData) {
		this.paramData = paramData;
	}

	// 文本
	get input() {
		const _t = this;
		let fragment = [], // 文本代码片段
			propsFragment = []; // props

		propsFragment = [
			`// ${_t.title}`,
			`${_t.param}Props : {`,
			`	value : searchParams.${_t.param},`,
			`	onChange(e) {`,
			`		updateState({`,
	        `            searchParams : {`,
	        `                ${_t.param} : e.target.value`,
	        `            }`,
	        `        })`,
			`	},`,
			`	placeholder : '请输入${_t.title}',`,
			`	maxLength : '32'`,
			`},`
		];

		// 文本代码片段
		fragment = [
			`<Input {...vtxGridParams.${_t.param}Props}/>`
		];

		return {
			props : propsFragment.map(item => `${indent(_t.indentNum)}${item}`),
			render : fragment.map(item => `${indent(_t.indentNum)}${item}`)
		}
	}

	// 下拉选
	get select() {
		const _t = this;
		let fragment = [], // 文本代码片段
			propsFragment = []; // props

		propsFragment = [
			`// ${_t.title}`,
			`${_t.param}Props : {`,
			`	value : searchParams.${_t.param},`,
		    `    placeholder : "请选择${_t.title}",`,
		    `    onChange(value) {`,
			`		updateState({`,
	        `            searchParams : {`,
	        `                ${_t.param} : value`,
	        `            }`,
	        `        })`,
		    `    },`,
		    `    allowClear : true,`,
		    `    style : {`,
		    `        width : '100%'`,
		    `    }`,
			`},`
		];

		// 文本代码片段
		fragment = [
			`<Select {...vtxGridParams.${_t.param}Props}>`,
			`	{${_t.paramData}.map(item => {`,
			`		return <Option key={item.id}>{item.name}</Option>`,
			`	})}`,
			`</Select>`
		];
		
		return {
			props : propsFragment.map(item => `${indent(_t.indentNum)}${item}`),
			render : fragment.map(item => `${indent(_t.indentNum)}${item}`)
		}
	}

	// 日刷选
	get date() {
		const _t = this;
		let fragment = [], // 文本代码片段
			propsFragment = []; // props

		propsFragment = [
			`// ${_t.title}`,
			`${_t.param}Props : {`,
			`	value : searchParams.${_t.param},`,
	        `    onChange(date, dateString) {`,
	        `		updateState({`,
	        `            searchParams : {`,
	        `                ${_t.param} : dateString`,
	        `            }`,
	        `        })`,
	        `    },`,
	        `    showTime : true,`,
	        `    style : {`,
	        `        width : '100%'`,
	        `    },`,
	        `    disabledDate(current) {`,
	        `        return VtxTimeUtil.isAfterDate(current);`,
	        `    }`,
			`},`
		];
		
		// 文本代码片段
		fragment = [
			`<VtxDatePicker {...vtxGridParams.${_t.param}Props}/>`
		];
		
		return {
			props : propsFragment.map(item => `${indent(_t.indentNum)}${item}`),
			render : fragment.map(item => `${indent(_t.indentNum)}${item}`)
		}
	}

	// 月刷选
	get month() {
		const _t = this;
		let fragment = [], // 文本代码片段
			propsFragment = []; // props

		propsFragment = [
			`// ${_t.title}`,
			`${_t.param}Props : {`,
			`	value : searchParams.${_t.param},`,
	        `    onChange(date, dateString) {`,
	        `		updateState({`,
	        `            searchParams : {`,
	        `                ${_t.param} : dateString`,
	        `            }`,
	        `        })`,
	        `    },`,
	        `    style : {`,
	        `        width : '100%'`,
	        `    },`,
	        `    disabledDate(current) {`,
	        `        return VtxTimeUtil.isAfterDate(current);`,
	        `    }`,
			`},`
		];

		// 文本代码片段
		fragment = [
			`<VtxMonthPicker {...vtxGridParams.${_t.param}Props}/>`
		];

		return {
			props : propsFragment.map(item => `${indent(_t.indentNum)}${item}`),
			render : fragment.map(item => `${indent(_t.indentNum)}${item}`)
		}
	}

	// 年刷选
	get year() {
		const _t = this;
		let fragment = [], // 文本代码片段
			propsFragment = []; // props

		propsFragment = [
			`// ${_t.title}`,
			`${_t.param}Props : {`,
			`	value : searchParams.${_t.param},`,
	        `    onChange(date, dateString) {`,
	        `		updateState({`,
	        `            searchParams : {`,
	        `                ${_t.param} : dateString`,
	        `            }`,
	        `        })`,
	        `    },`,
	        `    style : {`,
	        `        width : '100%'`,
	        `    },`,
	        `    disabledDate(current) {`,
	        `        return VtxTimeUtil.isAfterDate(current);`,
	        `    }`,
			`},`
		];

		// 文本代码片段
		fragment = [
			`<VtxYearPicker {...vtxGridParams.${_t.param}Props}/>`
		];

		return {
			props : propsFragment.map(item => `${indent(_t.indentNum)}${item}`),
			render : fragment.map(item => `${indent(_t.indentNum)}${item}`)
		}
	}

	// 时间段
	get range() {
		const _t = this;
		let fragment = [], // 文本代码片段
			propsFragment = []; // props

		propsFragment = [
			`// ${_t.title}`,
			`${_t.param}Props : {`,
			`	value : [searchParams.${_t.param}, searchParams.${_t.param1}],`,
	        `    onChange(date, dateString) {`,
	        `		updateState({`,
	        `            searchParams : {`,
	        `                ${_t.param} : dateString[0],`,
	        `                ${_t.param1} : dateString[1]`,
	        `            }`,
	        `        })`,
	        `    },`,
	        `    showTime : true,`,
	        `    style : {`,
	        `        width : '100%'`,
	        `    },`,
	        `    disabledDate(current) {`,
	        `        return current && VtxTimeUtil.isAfterDate(current);`,
	        `    }`,
			`},`
		];

		// 文本代码片段
		fragment = [
			`<VtxRangePicker {...vtxGridParams.${_t.param}Props}/>`
		];

		return {
			props : propsFragment.map(item => `${indent(_t.indentNum)}${item}`),
			render : fragment.map(item => `${indent(_t.indentNum)}${item}`)
		}
	}
}

const gc = new GirdCellB();
module.exports = gc;