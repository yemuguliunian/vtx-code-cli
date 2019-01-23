/**
 * 初始化list modal
 */
const { dedupe, firstUpperCase, split_array, indent } = require('../../util/vtxUtil.js');

const stateC  = require('../template/StateCell');
const effectC  = require('../template/EffectCell');
const _ = require('lodash');

function initModal(body) {

	const { namespace, annotation, searchParams } = body;

	let fragment = [], // 代码片段
		effectFragment = [],
		queryState = [], // 查询参数
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

		paramData && paramDataState.push({
			key : paramData,
			param : param,
			title : title
		});
	}

	// 参数数据源去重
	paramDataState = _.uniqBy(paramDataState, 'key');

	effectC.setNameSpace = namespace;
	effectC.setIndentNum = 8;
	// 下拉参数
	paramDataState.map(item => {
		effectFragment.push(...effectC.generateSelect(item));
		effectFragment.push(``);
	})
	// 列表
	effectFragment.push(...effectC.getList());
	
	fragment = [
		`import { demoService } from '...';`,
		``,
		`const u = require('updeep');`,
		`import { VtxUtil } from '...';`,
		``,
		`// 查询条件`,
		`let initQueryParams = {`,
			...queryState,
		`};`,
		``,
		`const initState = {`,
		`    searchParams : {...initQueryParams}, // 搜索参数`,
		`    queryParams : {...initQueryParams}, // 查询列表参数`,
			 ...paramDataState.map(item => `${indent(4)}${item.key} : [], // ${item.title}下拉数据`),
		`    currentPage : 1, // 页码`,
		`    pageSize : 10, // 每页条数`,
		`    loading : false, // 列表是否loading`,
		`    dataSource : [], // 列表数据源`,
		`    total : 0 // 列表总条数`,
		`};`,
		``,
		`export default {`,
		``,
		`    namespace : '${namespace}', // ${annotation || ''}`,	
		``,
		`    state : {...initState},`,
		``,
		`    subscriptions: {`,
		`        setup({ dispatch, history }) {`,
		`            return history.listen(({ pathname, search }) => {`,
		`                if(pathname === '/${namespace}') {`,
		`					// 初始化state`,
		`                    dispatch({`,
		`                        type : 'updateState',`,
		`                        payload : {`,
		`                            ...initState`,
		`                        }`,
		`                    })`,
							 ...paramDataState.map(item => {
							 	return `${indent(20)}// 请求${item.title}下拉数据\n` +
							 			`${indent(20)}dispatch({type : 'load${firstUpperCase(item.key)}'});`
							 }),
		`                    dispatch({type : 'getList'});`,
		`                }`,
		`            })`,
		`        }`,
		`    },`,
		``,
		`    effects : {`,
				...effectFragment,
		`    },`,
		``,
		`    reducers : {`,
		`		updateState(state,action){`,
		`            return u(action.payload, state);`,
		`        },`,
		``,
		`		updateQueryParams(state,action) {`,
		`            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));`,
		`            return {`,
		`                ...state,`,
		`                ...action.payload,`,
		`                selectedRowKeys : [],`,
		`                currentPage : 1,`,
		`                queryParams : queryParams`,
		`            }`,
		`        },`,
		``,
		`        initQueryParams(state,action) {`,
		`            return {`,
		`                ...state,`,
		`                ...action.payload,`,
		`                currentPage : 1,`,
		`                pageSize : 10,`,
		`				searchParams : initQueryParams,`,
		`                queryParams : initQueryParams`,
		`            }`,
		`        }`,
		`    }`,
		`}`
	];
	
	return fragment.join('\n');
}

module.exports = initModal;
