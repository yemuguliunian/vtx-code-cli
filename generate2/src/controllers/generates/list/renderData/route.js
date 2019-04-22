const _ = require('lodash');

// route
module.exports = function getRouteParams({searchParams, parameters, listParams}) {

	let searchParamsDatas = [], // 查询参数中下拉的数据源
		paramDatas = [], // 所有下拉的数据源
		girdTitle = [], // vtxGird title
		girdWidth = [], // vtxGird width
		girdParams = [], // vtxGird props
		girdChildList = [], // gird children
		vtxUi = ['VtxDatagrid'], // vtx-ui组件
	    vtxDateUi = [], // 日期组件
		antd = ['Modal', 'Button', 'message']; // antd组件

	let existInput = false, // 是否存在文本
    	existSelect = false, // 是否存在下拉
    	existDay = false, // 是否存在日刷选
    	existMonth = false, // 是否存在月刷选
    	existYear = false, // 是否存在年刷选
    	existRange = false; // 是否存在时间段

	// 查询参数
	for(var i = searchParams.length - 1; i >= 0; i--) {
		const { title, param, param1, type, paramData, gird } = searchParams[i];

		girdTitle.push(`'${title}'`);
		girdWidth.push(gird);

		paramData && searchParamsDatas.push(paramData);

		switch(type) {
			case 'text' : // 文本
				!existInput && (existInput = true);
			break;
			case 'select' : // 下拉选
				!existSelect && (existSelect = true);
			break;
			case 'day' : // 日刷选
				!existDay && (existDay = true);
			break;
			case 'month' : // 月刷选
				!existMonth && (existMonth = true);
			break;
			case 'year' : // 年刷选
				!existYear && (existYear = true);
			break;
			case 'range' : // 时间段
				!existRange && (existRange = true);
			break;
			default : 
				// 无逻辑
			break;
		}
	}

	// 去重
	paramDatas = _.uniq(searchParamsDatas);

	searchParams.length > 0 && vtxUi.push('VtxGrid');
	// 存在文本
	existInput && antd.push('Input');
	// 存在下拉
	existSelect && antd.push('Select');
	if(existDay || existMonth || existYear || existRange) {
		vtxUi.push('VtxDate');
		// 存在日刷选
		existDay && vtxDateUi.push('VtxDatePicker');
		// 存在月刷选
		existMonth && vtxDateUi.push('VtxMonthPicker');
		// 存在年刷选
		existYear && vtxDateUi.push('VtxYearPicker');
		// 时间段
		existRange && vtxDateUi.push('VtxRangePicker');
	}

	return {
		searchParams : searchParams.reverse(),
		searchParamsDatas, 
		paramDatas, 
		girdTitle, 
		girdWidth, 
		girdParams, 
		girdChildList,
		vtxUi, 
	    vtxDateUi,
		antd,
		existSelect,
		listParams : listParams.reverse(),
		type : 'list'
	}

}