/**
 * 空模板 modal
 */

function initModal(body) {

	const { namespace, annotation } = body;

	let fragment = [];

	fragment = [
		`const u = require('updeep');`,
		``,
		`const initState = {`,
		``,
		`};`,
		``,
		`export default {`,
		``,
		`	namespace : '${namespace}', // ${annotation}`,
		``,
		`	state : {...initState},`,
		``,
		`	subscriptions: {`,
		`        setup({ dispatch, history }) {`,
		`            return history.listen(({ pathname, search }) => {`,
		`                if(pathname === '/${namespace}') {`,
		`                    // 初始化state`,
		`                    dispatch({`,
		`                        type : 'updateState',`,
		`                        payload : {`,
		`                            ...initState`,
		`                        }`,
		`                    })`,
		`                }`,
		`            })`,
		`        }`,
		`    },`,
		``,
		`    effects : {`,
		``,
		`    },`,
		``,
		`    reducers : {`,
		`    	updateState(state, action){`,
		`            return u(action.payload, state);`,
		`        }`,
		`    }`,
		`}`
	];
	
	return fragment.join('\n');
}

module.exports = initModal;
