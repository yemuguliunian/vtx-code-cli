const _ = require('lodash');

// modal
module.exports = function getModalParams({searchParams, parameters}) {

	let searchParamStates = [], // 查询参数state
		paramDatas = []; // 所有下拉的数据源

	// 查询参数
	for(var i = searchParams.length - 1; i >= 0; i--) {
		const { title, type, param, param1, paramData } = searchParams[i];

		searchParamStates.unshift({type, title, param});
		['range'].indexOf(type) > -1 && searchParamStates.push({type, title, param:param1});

		paramData && paramDatas.push({
			key : paramData,
			param : param,
			title : title
		});
	}

	// 参数数据源去重
	paramDatas = _.uniqBy(paramDatas, 'key'); 

	return {
		paramDatas,
		searchParamStates,
		parameters
	}

}