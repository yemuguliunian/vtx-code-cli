import { demoService } from '...';
import { getReportCommonParm } from '...';

const u = require('updeep');

// 查询条件
let initQueryParams = {
	<% searchParams.map(item=> { %>
    <%= item.param%> : <%= `${defaultValue[item.type]}` %>, // <%= item.title -%>
    <% }) %>
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询参数
	
	report_code : '',
	iframeSrc : ''
};

export default {

    namespace : '<%= namespace %>', // <%= annotation %>

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/<%= namespace %>') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
					
					dispatch({type : 'getReportCommonParm'}).then(() => {
                        dispatch({type : 'getUrl'});
                    });
                }
            })
        }
    },

    effects : {
		
        // 获取报表参数
		*getReportCommonParm({ payload }, {call, put, select}) {
            let { data } = yield call(getReportCommonParm);
            if(!!data && 'result' in data) {
				if(!data.result && 'data' in data) {
					let objName=data.data.filter((item)=>{return item.parmCode=='cityName'});
	                let objUnit=data.data.filter((item)=>{return item.parmCode=='cityUnit'});
	                yield put({
	                    type: 'updateState',
	                    payload: {
	                        cityName:objName&&objName.length>0?objName[0].parmName:'',
	                        cityUnit:objUnit&&objUnit.length>0?objUnit[0].parmName:''
	                    }
	                });
				}
			}
        },

		*getUrl({ payload }, {call, put, select}) {
            const {
                queryParams, cityName, cityUnit, report_code
            } = yield select(({<%= namespace %>}) => <%= namespace %>);
            <% if (queryParams.length < 6) { %>
            const { <%= queryParams.join(', ') %> }  = queryParams;
            <% } -%>
            <% if (queryParams.length >= 6) { %>
            const {
                <%chunk(queryParams, 5).map((item, index) => { %>
                <%= item.join(', ') %><%= index+1!=chunk(queryParams, 5).length ? ',' : ''-%> 
                <%})%>
            } = queryParams;
            <% } -%>   
            let param={
                report_code: report_code,
                data_param: {
                    
                },
                report_param: {
                    cityName,
                    cityUnit,
                    title : '',
                    date : ''
                }
            }
            param=JSON.stringify(param);
           	let iframeSrc = `rps/#/rps?param=${param}`;
            yield put({
                type: 'updateState',
                payload: {
                    iframeSrc: iframeSrc
                }
            });
        }
    },

    reducers : {
		updateState(state,action){
            return u(action.payload, state);
        },

		updateQueryParams(state,action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                queryParams : queryParams
            }
        },

        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
				searchParams : initQueryParams,
                queryParams : initQueryParams
            }
        }
    }
}