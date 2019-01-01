/**
 * 初始化CURD modal
 */
const vtxUtil = require('../../util/vtxUtil.js');
const split_array = vtxUtil.split_array;

const stateC  = require('../template/StateCell');

function initModal(body) {

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

	fragment = [
		...queryState,
		``,
		`// 新增参数`,
		`let defaultNewItem = {`,
			...newItemState,
		`};`,
		``,
		`const initState = {`,
		`    currentPage : 1,`,
		`    pageSize : 10,`,
		`    loading : false,`,
		`    dataSource : [],`,
		`    total : 0,`,
		`    selectedRowKeys : [],`,
		`    newItem : {...defaultNewItem}`,
		`    editItem:{`,
		`        visible:false,`,
		`        loading:false`,
		`    }`,
		`    viewItem: {`,
		`        visible:false`,
		`    }`,
		`};`,
		``,
		`export default {`,
		``,
		`    namespace : '${namespace}',`,	
		``,
		`    state : {...initState},`,
		``,
		`    subscriptions: {`,
		`        setup({ dispatch, history }) {`,
		`            return history.listen(({ pathname, search }) => {`,
		`                if(pathname === '/${namespace}') {`,
		`                }`,
		`            })`,
		`        }`,
		`    },`,
		``,
		`    effects : {`,
		`    },`,
		``,
		`    reducers : {`,
		`		updateState(state,action){`,
		`            return {`,
		`                ...state,`,
		`                ...action.payload`,
		`            }`,
		`        },`,
		``,
		`		updateNewItem(state, action){`,
		`            return {`,
		`                ...state,`,
		`                newItem:{`,
		`                    ...state.newItem,`,
		`                    ...action.payload`,
		`                }`,
		`            }`,
		`        },`,
		``,
		`        initNewItem(state, action){`,
		`            return {`,
		`                ...state,`,
		`                newItem:{`,
		`                    ...defaultNewItem,`,
		`                    visible:true`,             
		`                }`,
		`            }`,
		`        },`,
		``,
		`        updateEditItem(state, action){`,
		`            return {`,
		`                ...state,`,
		`                editItem:{`,
		`                    ...state.editItem,`,
		`                    ...action.payload`,
		`                }`,
		`            }`,
		`        },`,
		``,
		`        updateViewItem(state, action){`,
		`            return {`,
		`                ...state,`,
		`                viewItem:{`,
		`                    ...state.viewItem,`,
		`                    ...action.payload`,
		`                }`,
		`            }`,
		`        }`,
		`    }`,
		`}`
	];
	
	return fragment.join('\n');
}

module.exports = initModal;
