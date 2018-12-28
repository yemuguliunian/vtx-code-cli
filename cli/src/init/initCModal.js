/**
 * 初始化CURD modal
 */
const vtxUtil = require('../util/vtxUtil.js');
const split_array = vtxUtil.split_array;

const stateC  = require('../template/StateCell');

function initCModal(body) {

	const { namespace, searchParams, parameters } = body;

	let fragment = [], // 代码片段
		queryParams = [], // 查询参数
		newItemParams = [], // 新增参数
		paramDatas = []; // 数据来源

	for(var i = searchParams.length - 1; i >= 0; i--) {
		const { title, param, param1, type, paramData } = searchParams[i];

		stateC.setParam = param;
		stateC.setParam1 = param1;
		stateC.setTitle = title;
		stateC.setType = type;
		stateC.indentNum = 4;
		stateC.setIsLast = i === 0;

		if(['range'].indexOf(type) > -1) {
			queryParams = queryParams.concat(stateC.cellTemplate);
		} else {
			queryParams.push(stateC.cellTemplate);
		}

		paramDatas.push(paramData);
	}

	for(var i = parameters.length - 1; i >= 0; i--) {
		const { title, param, param1, type, paramData } = parameters[i];

		stateC.setParam = param;
		stateC.setParam1 = param1;
		stateC.setTitle = title;
		stateC.setType = type;
		stateC.indentNum = 4;
		stateC.setIsLast = i === 0;

		if(['range'].indexOf(type) > -1) {
			newItemParams = newItemParams.concat(stateC.cellTemplate);
		} else {
			newItemParams.push(stateC.cellTemplate);
		}

		paramDatas.push(paramData);
	}

	if(queryParams.length > 0) {
		queryParams = [
			`// 查询条件`,
			`let initQueryParams = {`,
				...queryParams,
			`};`
		];
	}

	if(newItemParams.length > 0) {
		newItemParams = [
			`// 新增参数`,
			`let defaultNewItem = {`,
				...newItemParams,
			`};`
		];
	}

	fragment = [
		...queryParams,
		``,
		...newItemParams
	];
	
	return fragment.join('\n');
}

module.exports = initCModal;
