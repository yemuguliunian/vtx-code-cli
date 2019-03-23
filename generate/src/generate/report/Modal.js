/**
 * 初始化report modal
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
		queryParams = [],
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

		queryParams.push(param);
		param1 && queryParams.push(param1);

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

	// 获取cityName cityUnit
	effectFragment.push(...[
		``,
		`*getReportCommonParm({ payload }, {call, put, select}) {`,
        `    let { data } = yield call(getReportCommonParm);`,
        `    if(!!data && 'result' in data) {`,
		`		if(!data.result && 'data' in data) {`,
		`			let objName=data.data.filter((item)=>{return item.parmCode=='cityName'});`,
	    `            let objUnit=data.data.filter((item)=>{return item.parmCode=='cityUnit'});`,
	    `            yield put({`,
	    `                type: 'updateState',`,
	    `                payload: {`,
	    `                    cityName:objName&&objName.length>0?objName[0].parmName:'',`,
	    `                    cityUnit:objUnit&&objUnit.length>0?objUnit[0].parmName:''`,
	    `                }`,
	    `            });`,
		`		}`,
		`	}`,
        `},`
	].map(item => `${indent(8)}${item}`));

	// getUrl
	effectFragment.push(...[
		``,
		`*getUrl({ payload }, {call, put, select}) {`,
        `    const {`,
        `        queryParams, cityName, cityUnit, report_code`,
        `    } = yield select(({${namespace}}) => ${namespace});`,
        `    const { ${queryParams.join(', ')} }  = queryParams;`,
        ``,
        `    let param={`,
        `        report_code: report_code,`,
        `        data_param: {`,
        ``,            
        `        },`,
        `        report_param: {`,
        `            cityName,`,
        `            cityUnit,`,
        `            title : '',`,
        `            date : ''`,
        `        }`,
        `    }`,
        `    param=JSON.stringify(param);`,
        '    let carOilSrc_d = `rps/#/rps?param=${param}`;',
        `    yield put({`,
        `        type: 'updateState',`,
        `        payload: {`,
        `            iframeSrc: carOilSrc_d`,
        `        }`,
        `    });`,
        `}`
	].map(item => `${indent(8)}${item}`));
	
	fragment = [
		`import { demoService } from '...';`,
		``,
		`const u = require('updeep');`,
		``,
		`// 查询条件`,
		`let initQueryParams = {`,
			...queryState,
		`};`,
		``,
		`const initState = {`,
		`    searchParams : {...initQueryParams}, // 搜索参数`,
		`    queryParams : {...initQueryParams}, // 查询参数`,
			 ...paramDataState.map(item => `${indent(4)}${item.key} : [], // ${item.title}下拉数据`),
		`	report_code : '',`,
		`	iframeSrc : ''`,
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
		`					dispatch({type : 'getReportCommonParm'}).then(() => {`,
		`                        dispatch({type : 'getUrl'});`,
		`                    });`,
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
		`                queryParams : queryParams`,
		`            }`,
		`        },`,
		``,
		`        initQueryParams(state,action) {`,
		`            return {`,
		`                ...state,`,
		`                ...action.payload,`,
		`				 searchParams : initQueryParams,`,
		`                queryParams : initQueryParams`,
		`            }`,
		`        }`,
		`    }`,
		`}`
	];
	
	return fragment.join('\n');
}

module.exports = initModal;
