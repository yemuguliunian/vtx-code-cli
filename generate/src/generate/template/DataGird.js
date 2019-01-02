/**
 * 查看
 */
const vtxUtil = require('../../util/vtxUtil.js');
const indent = vtxUtil.indent;

const _columns = Symbol('columns');

class DataGird {

	constructor() { 
		// 类型
		this.type = '';
		// Param
		this.params = [];
		// width
		this.namespace = '';
		// 缩进位数
		this.indentNum = 0;
	}
	
	get getType() {
		return this.type;
	}
	set setType(type) {
		this.type = type;
	}
	get getParams() {
		return this.params;
	}
	set setParams(param) {
		this.params = params;
	}
	get getNamespace() {
		return this.namespace;
	}
	set setTitle(namespace) {
		this.namespace = namespace;
	}
	get getIndentNum() {
		return this.indentNum;
	}
	set setIndentNum(indentNum) {
		this.indentNum = indentNum;
	}

	[_columns]() {
		const _t = this;
		let fragment = [
			`// 列表`,
			`const columns = [`,
				...this.params.map(item => {
					return `    ['${item.title}', '${item.param}']`;
				}),
				...(this.type === 'curd' ? [
					`['操作', 'action', { renderButtons : () => {`,
					`	let btns = [];`,
			        `	btns.push({`,
			        `		name:'查看',`,
			        `		onClick(rowData) {`,
			        `            dispatch({`,
			        `                type : '${_t.namespace}/updateViewItem',`,
			        `                payload : {`,
			        `                    ...rowData`,
			        `                }`,
			        `            })`,
			        `            updateViewWindow();`,
			        `		}`,
			        `	})`,
		        	`	btns.push({`,
			        `		name:'编辑',`,
			        `		onClick(rowData) {`,
			        `			dispatch({`,
			        `				type : '${_t.namespace}/updateEditItem',`,
			        `				payload : {`,
		        	`					...rowData`,
			        `				}`,
			        `			})`,
			        `			updateEditWindow();`,
			        `		}`,
			        `	})`,
			        `	return btns;`,
					`}, width : '120px'}]`
				].map(item => `${indent(4)}${item}`) : [])
			`];`
		];

		return fragment;
	}

	// 标准查看模板
	get curd() {
		
	}
}


const dg = new DataGird();
module.exports = dg;