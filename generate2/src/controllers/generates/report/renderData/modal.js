/**
 * 报表modal
 * @type {[type]}
 */
const _ = require('lodash');

module.exports = function getModalParams({searchParams}) {

	let queryParams = [], // 查询参数
        queryParamData = []; // 数据来源

    for(var i = searchParams.length - 1; i >= 0; i--) {
        const { title, param, param1, type, paramData } = searchParams[i];

        queryParams.push(param);
        param1 && queryParams.push(param1);

        paramData && queryParamData.push({
            key : paramData,
            param : param,
            title : title
        });
    }

    // 去重, 对象属性若存在重复在IE严格模式下报错
    queryParams = _.uniq(queryParams);
    // 参数数据源去重
    queryParamData = _.uniqBy(queryParamData, 'key');

    return {
    	searchParams,
    	queryParams,
    	queryParamData
    };
}