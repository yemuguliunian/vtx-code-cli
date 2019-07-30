import { demoService } from '@services/..';

import _ from 'lodash';
const u = require('updeep');
import { VtxUtil } from '@utils/utils';

// 查询条件
let initQueryParams = {
	<% modal.searchParamStates.map(item=> { %>
    <%= item.param%>: <%- `${defaultValue[item.type]}` %>, // <%= item.title -%>
    <% }) %>
};

// 新增参数
let defaultNewItem = {
	<% modal.parameters.map(item=> { %>
    <%= item.param%>: <%- `${defaultValue[item.type]}` %>, // <%= item.title -%>
    <% }) %>
};

const initState = {
    searchParams: {...initQueryParams}, // 搜索参数
    queryParams: {...initQueryParams}, // 查询列表参数
    <% modal.paramDatas.map(item=> { %>
    <%= item.key%>: [], // <%= item.title -%>下拉数据
    <% }) %>
    currentPage: 1, // 页码
    pageSize: 10, // 每页条数
    loading: false, // 列表是否loading
    dataSource: [], // 列表数据源
    total: 0, // 列表总条数
    selectedRowKeys: [],
    newItem: {...defaultNewItem}, // 新增参数
    editItem: { // 编辑参数
        visible: false,
        loading: false
    },
    viewItem: { // 查看参数
        visible: false
    }
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
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    <% modal.paramDatas.map(item=> { %>
                    // 请求<%= item.title -%>下拉数据
                    dispatch({type: 'load<%=upperFirst(item.key)%>'});
                    <% }) %>
                    dispatch({type: 'getList'});
                }
            })
        }
    },

    effects : {
		<% modal.paramDatas.map(item=> { %>
        // <%= item.title -%>下拉
        *load<%=upperFirst(item.key)%>({ payload }, { call, put, select }) {
            const { data } = yield call(load<%=upperFirst(item.key)%>);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            <%= item.key%>: data.data
                        }
                    })
                }
            }
        },
        <% }) %>
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({<%= namespace %>}) => <%= namespace %>);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page: currentPage - 1,
                size: pageSize
            };
            const { data } = yield call(demoService.getList, VtxUtil.handleTrim(params));
            let dataSource = [], total = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item, 
                        key: item.id
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                total,
                loading: false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type: 'updateState',
                payload: {...uState}
            })
        },

        // 新增or编辑
        *saveOrUpdate({ payload }, { call, put, select }) {
           yield put({
                type: 'updateState',
                payload: {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
            const { newItem, editItem } = yield select( ({<%= namespace %>}) => <%= namespace %> );
            const {
                <%_ if (modal.addParams.length < 7) { _%>
                <%= modal.addParams.join(', ') %>
                <%_ } _%>
                <%_ if (modal.addParams.length >= 7) { _%>
                <%_ chunk(modal.addParams, 6).map((item, index) => { _%>
                <%= item.join(', ') %>,
                <%_ }) _%>
                <%_ } _%>  
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                <%_ if (modal.addParams.length < 7) { _%>
                <%= modal.addParams.join(', ') %>,
                <%_ } _%>
                <%_ if (modal.addParams.length >= 7) { _%>
                <%_ chunk(modal.addParams, 6).map((item, index) => { _%>
                <%= item.join(', ') %>,
                <%_ }) _%>
                <%_ } _%>   
                userId: userId,
                tenantId: tenantId
            };
            const { data } = yield call( payload.btnType === 'add' ? 
                    demoService.save : demoService.update, VtxUtil.handleTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError();
            }
           yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : false }
                }
            });
        },

        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids: ids.join(',')
            };
            const { data } = yield call(demoService.delete, params);
            if( !!data && data.result == 0 ){
                payload.onSuccess(ids);
            } else {
                payload.onError( data ? data.msg : '删除失败' );
            }
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
                selectedRowKeys: [],
                currentPage: 1,
                queryParams: queryParams
            }
        },

        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                currentPage: 1,
                pageSize: 10,
				searchParams: initQueryParams,
                queryParams: initQueryParams
            }
        },

        initNewItem(state, action){
            return {
                ...state,
                newItem: {
                    ...defaultNewItem         
                }
            }
        }
    }
}