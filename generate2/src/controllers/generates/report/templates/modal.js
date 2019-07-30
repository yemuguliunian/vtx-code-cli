import { demoService } from '@services/..';

const u = require('updeep');

// 查询条件
let initQueryParams = {
	<% modal.searchParams.map(item=> { %>
    <%= item.param%> : <%- `${defaultValue[item.type]}` %>, // <%= item.title -%>
    <%_ if(['range'].indexOf(item.type) > -1) { _%>
    <%= item.param1%> : <%- `${defaultValue[item.type]}` %>, // <%= item.title -%>
    <%_ } _%>
    <% }) %>
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
	<% modal.queryParamData.map(item=> { %>
    <%= item.key%> : [], // <%= item.title -%>下拉数据
    <% }) %>
    reportFlag: ''
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
                    <% modal.queryParamData.map(item=> { %>
                    // 请求<%= item.title -%>下拉数据
                    dispatch({type: 'load<%=upperFirst(item.key)%>'});
                    <% }) %>
                }
            })
        }
    },

    effects : {
		
    },

    reducers : {
		updateState(state,action){
            return u(action.payload, state);
        },

        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
				searchParams : initQueryParams
            }
        }
    }
}