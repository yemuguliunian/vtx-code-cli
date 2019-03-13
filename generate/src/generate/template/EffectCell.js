/**
 * 新增
 */
const { indent, firstUpperCase } = require('../../util/vtxUtil.js');

class EffectCell {

	constructor() { 
		// nameSpace
		this.nameSpace = '';
		// 缩进位数
		this.indentNum = 0;
	}

	get getNameSpace() {
		return this.nameSpace;
	}
	set setNameSpace(nameSpace) {
		this.nameSpace = nameSpace;
	}
	get getIndentNum() {
		return this.indentNum;
	}
	set setIndentNum(indentNum) {
		this.indentNum = indentNum;
	}

	// 下拉数据源
	generateSelect({key, title, param}) {
		const _t = this;
		let effect;
		param && (effect = `load${firstUpperCase(key)}`);
		// 代码片段
		let fragment = [
			`// ${title}下拉`,
	        `*${effect}({ payload }, { call, put, select }) {`,
	        `    const { data } = yield call(${effect});`,
	        `    if(!!data && !data.result) {`,
	        `        if('data' in data && Array.isArray(data.data)) {`,
	        `            yield put({`,
	        `                type : 'updateState',`,
	        `                payload : {`,
	        `                    ${key} : data.data`,
	        `                }`,
	        `            })`,
	        `        }`,
	        `    }`,
	        `},`
		];

		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 列表
	getList() {
		const _t = this;
		// 代码片段
		let fragment = [
			`// 获取列表`,
	        `*getList({ payload = {} }, { call, put, select }) {`,
	        `    yield put({ type : 'updateState', payload : {loading : true} });`,
	        `    let {`,
	        `        pageSize, currentPage, queryParams`,
	        `    } = yield select(({${_t.nameSpace}}) => ${_t.nameSpace});`,
        	`	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;`,
	        `	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;`,
	        `    let params = {`,
	        `        ...queryParams,`,
	        `        page : currentPage,`,
	        `        rows : pageSize`,
	        `    };`,
	        `    const { data } = yield call(demoService.getList, VtxUtil.handleTrim(params));`,
	        `    let dataSource = [], total = 0, status = false;`,
	        `    if(!!data && !data.result) {`,
	        `        if('data' in data && Array.isArray(data.data.rows)) {`,
	        `            status = true;`,
	        `            dataSource = data.data.rows.map(item => ({`,
	        `                ...item, `,
	        `                key : item.id`,
	        `            }));`,
	        `            total = data.data.total;`,
	        `        }`,
	        `    }`,
	        // `    yield put({`,
	        // `        type : 'updateState',`,
	        // `        payload : {`,
	        // `            dataSource,`,
	        // `            total,`,
	        // `            loading : false`,
	        // `        }`,
	        // `    })`,
	        // `    return status;`,
		    `    let uState = {`,
	        `        dataSource,`,
	        `        total,`,
	        `        loading : false`,
	        `    };`,
	        `    // 请求成功 更新传入值`,
	        `    status && (uState = {...uState, ...payload});`,
	        `    yield put({`,
	        `        type : 'updateState',`,
	        `        payload : {...uState}`,
	        `    })`,
	        `},`
		];

		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

}

const effectC = new EffectCell();

module.exports = effectC;