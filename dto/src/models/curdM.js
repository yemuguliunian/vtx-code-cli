import { cliCurd } from '../services/service';

import cache from '../utils/cache.js';
import moment from 'moment';

export default {

    namespace: 'curd',

    state: {
        namespace : '', // namespace
        annotation : '', // 注释
        author : '', // 作者
        searchParams : [],
        typeData : [
            {code : 'text', text : '文本'},
            {code : 'select', text : '下拉'},
            {code : 'ztreeSelect', text : '下拉树'},
            {code : 'day', text : '日'},
            {code : 'month', text : '月'},
            {code : 'year', text : '年'},
            {code : 'range', text : '时间段'}
        ],
        parameters : [],
        parameterTypeData : [
            {code : 'text', text : '文本'},
            {code : 'textarea', text : '文本域'},
            {code : 'select', text : '下拉'},
            {code : 'treeSelect', text : '下拉树'},
            {code : 'day', text : '日'},
            {code : 'month', text : '月'},
            {code : 'year', text : '年'},
            {code : 'upload', text : '附件'}
        ],
        listParams : [],
        distId : '',
        loading: false
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/curd') {
                    let cacheValue = cache.getItem('curd');
                    if(cacheValue) {
                        let state = JSON.parse(cacheValue);
                        dispatch({
                            type : 'updateState',
                            payload : {
                                ...state,
                                type : 'init'
                            }
                        })
                    }
                }
            })
        },
    },

    effects: {
        *cli({ payload }, { call, put, select }) {
            yield put({type: 'updateState', payload: {loading: true}});
            const { 
                namespace, annotation, author, searchParams, parameters, listParams 
            } = yield select(({curd}) => curd);
            const params = {
                namespace : namespace,
                annotation : annotation,
                author : author,
                searchParams : searchParams,
                parameters : parameters,
                listParams : listParams
            };
            const {data} = yield call(cliCurd, params);
            if(!!data && !data.result) {
                yield put({
                    type : 'updateState',
                    payload : {
                        distId : data.id
                    }
                })
            }
            yield put({type: 'updateState', payload: {loading: false}});
        }
    },

    reducers: {
        updateState(state, action){
            const { type } = action.payload;
            if(type !== 'init'){
                const cacheObj = _.cloneDeep({
                    ...state, 
                    ...action.payload
                });
                delete cacheObj.typeData;
                delete cacheObj.parameterTypeData;
                delete cacheObj.type;
                cache.setItem('curd', JSON.stringify({...cacheObj}));
            }
            return {
                ...state,
                ...action.payload
            }
        },

        newSearchParam(state, action) {
            const newData = _.cloneDeep(state.searchParams);
            const searchItem = {
                id : _.uniqueId(`searchParam_${moment().valueOf()}_`),
                title : '',
                param : '',
                paramData : '',
                param1 : '',
                type : 'text',
                gird : 1
            };
            newData.unshift(searchItem);
            return {
                ...state,
                searchParams : newData
            }
        },

        newParameter(state, action) {
            const newData = _.cloneDeep(state.parameters);
            const parameter = {
                id : _.uniqueId(`parameter_${moment().valueOf()}_`),
                title : '',
                param : '',
                paramStr : '',
                paramData : '',
                type : 'text',
                required : '1',
                repeat : '0',
                reg : '',
                width : 50
            };
            newData.unshift(parameter);
            return {
                ...state,
                parameters : newData
            }
        },

        newListParams(state, action) {
            const newData = _.cloneDeep(state.listParams);
            const listParam = {
                id : _.uniqueId(`list_${moment().valueOf()}_`),
                title : '',
                param : '',
            };
            newData.unshift(listParam);
            return {
                ...state,
                listParams : newData
            }
        },

        clearCache(state, action) {
            cache.removeItem('curd');
            return {
                ...state,
                ...action.payload
            }
        }
    }
};
