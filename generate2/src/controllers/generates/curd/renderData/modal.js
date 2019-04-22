const _ = require('lodash');

// route
module.exports = function getModalParams({searchParams, parameters}) {

	let addParams = ['id'], // 新增参数
		searchParamStates = [], // 查询参数state
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

	// 新增参数
	for(var i = parameters.length - 1; i >= 0; i--) {
		const { title, param, paramData } = parameters[i];

		paramData && paramDatas.push({
			key : paramData,
			param : param,
			title : title
		});

		// 新增参数存储
		addParams.push(param);
	}

	// 参数数据源去重
	paramDatas = _.uniqBy(paramDatas, 'key'); 
	// 新增参数去重
	addParams = _.uniq(addParams);

	return {
		addParams,
		paramDatas,
		searchParamStates,
		parameters
	}

}