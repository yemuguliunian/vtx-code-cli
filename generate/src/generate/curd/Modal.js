/**
 * 初始化CURD modal
 */
const { dedupe, firstUpperCase, split_array, indent } = require('../../util/vtxUtil.js');

const stateC  = require('../template/StateCell');
const effectC  = require('../template/EffectCell');
const _ = require('lodash');

function initModal(body) {

	const { namespace, annotation, searchParams, parameters } = body;

	let fragment = [], // 代码片段
		addParams = ['id'], // 新增参数
		addParamsFragment = [],
		effectFragment = [],
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

		paramData && paramDataState.push({
			key : paramData,
			param : param,
			title : title
		});
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

		paramData && paramDataState.push({
			key : paramData,
			param : param,
			title : title
		});

		// 新增参数存储
		addParams.push(param);
	}

	// 参数数据源去重
	paramDataState = _.uniqBy(paramDataState, 'key');
	// 新增参数去重
	addParams = dedupe(addParams);

	effectC.setNameSpace = namespace;
	effectC.setIndentNum = 8;
	// 下拉参数
	paramDataState.map(item => {
		effectFragment.push(...effectC.generateSelect(item));
		effectFragment.push(``);
	})
	// 列表
	effectFragment.push(...effectC.getList());
	// 新增or编辑
	let splitArr = split_array(addParams, _config.param_split_num);
	addParamsFragment = splitArr.map((item, index) => {
		return `        ${item.join(', ')},`;
	})
	effectFragment.push(...[
		``,
		`// 新增or编辑`,
        `*saveOrUpdate({ payload }, { call, put, select }) {`,
        `	yield put({`,
        `        type : 'updateState',`,
        `        payload : {`,
        `            [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }`,
        `        }`,
        `    });`,
        `    const { newItem, editItem } = yield select( ({${namespace}}) => ${namespace} );`,
        `    const {`,
	       		...addParamsFragment,
        `    } = payload.btnType === 'add' ? newItem : editItem;`,
        `    let params = {`,
        		...addParamsFragment,	
        `        userId : userId,`,
        `        tenantId : tenantId`,
        `    };`,
        `    const { data } = yield call( payload.btnType === 'add' ? `,
        `            demoService.save : demoService.update, VtxUtil.handleTrim(params));`,
        `    if(!!data && data.result == 0) {`,
        `        yield put({type:'getList'});`,
        `        payload.onSuccess();`,
        `    } else {`,
        `        payload.onError();`,
        `    }`,
        `	yield put({`,
        `        type : 'updateState',`,
        `        payload : {`,
        `            [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : false }`,
        `        }`,
        `    });`,
        `},`
	].map(item => `${indent(8)}${item}`));
	// 删除
	effectFragment.push(...[
		``,
		`// 删除`,
        `*deleteItems({ payload }, { call, put, select }) {`,
        `    let { ids = [] } = payload;`,
        `    const params = {`,
        `        ids : ids.join(',')`,
        `    };`,
        `    const { data } = yield call(demoService.delete, params);`,
        `    if(!!data && data.result==0){`,
        `        payload.onSuccess(ids);`,
        `    }`,
        `    else{`,
        `        payload.onError( data ? data.msg : '删除失败' );`,
        `    }`,
        `}`
	].map(item => `${indent(8)}${item}`));

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
		`// 新增参数`,
		`let defaultNewItem = {`,
			...newItemState,
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
		`    total : 0, // 列表总条数`,
		`    selectedRowKeys : [],`,
		`    newItem : {...defaultNewItem}, // 新增参数`,
		`    editItem:{ // 编辑参数`,
		`        visible:false,`,
		`        loading:false`,
		`    },`,
		`    viewItem: { // 查看参数`,
		`        visible:false`,
		`    }`,
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
		`				 searchParams : initQueryParams,`,
		`                queryParams : initQueryParams`,
		`            }`,
		`        },`,
		``,
		`        initNewItem(state, action){`,
		`            return {`,
		`                ...state,`,
		`                newItem:{`,
		`                    ...defaultNewItem`,         
		`                }`,
		`            }`,
		`        }`,
		`    }`,
		`}`
	];
	
	return fragment.join('\n');
}

module.exports = initModal;
