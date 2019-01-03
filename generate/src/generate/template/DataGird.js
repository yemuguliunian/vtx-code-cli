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
	set setParams(params) {
		this.params = params;
	}
	get getNamespace() {
		return this.namespace;
	}
	set setNamespace(namespace) {
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
					return `    ['${item.title}', '${item.param}'],`;
				}),
				...(this.type === 'curd' ? [
					`['操作', 'action', { renderButtons : () => {`,
					`	let btns = [];`,
			        `	btns.push({`,
			        `		name:'查看',`,
			        `		onClick(rowData) {`,
			        `            dispatch({`,
			        `                type : '${_t.namespace}/updateSubState',`,
    				`				sub : 'viewItem',`,
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
			        `				type : '${_t.namespace}/updateSubState',`,
			        `				sub : 'editItem',`,
			        `				payload : {`,
		        	`					...rowData`,
			        `				}`,
			        `			})`,
			        `			updateEditWindow();`,
			        `		}`,
			        `	})`,
			        `	return btns;`,
					`}, width : '120px'}]`
				].map(item => `${indent(4)}${item}`) : []),
			`];`
		];
		return fragment;
	}

	get render() {
		const _t = this;
		let fragment = [
			...this[_columns](),
			`let vtxDatagridProps = {`,
			`	columns : handleColumns(columns),`,
		    `	dataSource,`,
		    `	indexColumn : true,`,
		    `    startIndex : ( currentPage - 1 )*pageSize+1,`,
		    `    autoFit:true,`,
		    `    // headFootHeight : 150,`,
		    `    loading,`,
		    `    onChange(pagination, filters, sorter){`,
		    `        dispatch({`,
		    `        	type:'${_t.namespace}/getList',`,
		    `        	payload : {`,
		    `        		currentPage : pagination.current,`,
		    `            	pageSize: pagination.pageSize`,
		    `        	}`,
		    `        }).then((status) => {`,
		    `        	if(status) {`,
		    `        		updateState({`,
			`	        		currentPage : pagination.current,`,
			`	                pageSize: pagination.pageSize`,
			`	        	})`,
		    `        	}`,
		    `        });`,
		    `    },`,
		    `    pagination:{`,
		    `        showSizeChanger: true,`,
		    `        pageSizeOptions: ['10', '20', '30', '40','50'],`,
		    `        showQuickJumper: true,`,
		    `        current:currentPage,` ,
		    `        total:total,` ,
		    `        pageSize,`,
		    '        showTotal: total => `合计 ${total} 条`',
		    `    },`,
			`};`,
			...(this.type === 'curd' ? [
				`vtxDatagridProps = _.assign(vtxDatagridProps, {`,
		        `    rowSelection : {`,
		        `        type:'checkbox',`,
		        `        selectedRowKeys,`,
		        `        onChange(selectedRowKeys, selectedRows){`,
		        `            updateState({`,
		        `                selectedRowKeys`,
		        `            });`,
		        `        }`,
		        `    }`,
		        `})`
			] : [])
		];

		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}
}


const dg = new DataGird();
module.exports = dg;