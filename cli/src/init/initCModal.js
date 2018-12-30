/**
 * 初始化CURD modal
 */
const vtxUtil = require('../util/vtxUtil.js');
const split_array = vtxUtil.split_array;

const stateC  = require('../template/StateCell');

function initCModal(body) {

	const { namespace, searchParams, parameters } = body;

	let fragment = [], // 代码片段
		queryState = [], // 查询参数
		newItemState = [], // 新增参数
		paramDataState = []; // 数据来源
	
	// 查询参数
	for(var i = searchParams.length - 1; i >= 0; i--) {
		const { title, param, param1, type, paramData } = searchParams[i];

		stateC.setParam = param;
		stateC.setParam1 = param1;
		stateC.setTitle = title;
		stateC.setType = type;
		stateC.indentNum = 4;
		stateC.setIsLast = i === 0;

		if(['range'].indexOf(type) > -1) {
			queryState = queryState.concat(stateC.cellTemplate);
		} else {
			queryState.push(stateC.cellTemplate);
		}

		paramDataState.push(paramData);
	}
	
	// 新增参数
	for(var i = parameters.length - 1; i >= 0; i--) {
		const { title, param, param1, type, paramData } = parameters[i];

		stateC.setParam = param;
		stateC.setParam1 = param1;
		stateC.setTitle = title;
		stateC.setType = type;
		stateC.indentNum = 4;
		stateC.setIsLast = i === 0;

		if(['range'].indexOf(type) > -1) {
			newItemState = newItemState.concat(stateC.cellTemplate);
		} else {
			newItemState.push(stateC.cellTemplate);
		}

		paramDataState.push(paramData);
	}

	if(queryState.length > 0) {
		queryState = [
			`// 查询条件`,
			`let initqueryState = {`,
				...queryState,
			`};`
		];
	}

	if(newItemState.length > 0) {
		newItemState = [
			`// 新增参数`,
			`let defaultNewItem = {`,
				...newItemState,
			`};`
		];

	}

	fragment = [
		...queryState,
		``,
		...newItemState,
		``,
		`const initState = {`,
		`    currentPage : 1,`,
		`    pageSize : 10,`,
		`    loading : false,`,
		`    dataSource : [],`,
		`    total : 0,`,
		`    selectedRowKeys : [],`
	];
	
	return fragment.join('\n');
}

module.exports = initCModal;
