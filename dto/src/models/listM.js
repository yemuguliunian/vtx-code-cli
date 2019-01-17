import { cliList } from '../services/service';

import cache from '../utils/cache.js';
import moment from 'moment';

export default {

    namespace: 'list',

    state: {
        namespace : '', // namespace
        annotation : '', // 注释
        author : '', // 作者
        searchParams : [],
        typeData : [
            {code : 'text', text : '文本'},
            {code : 'select', text : '下拉'},
            {code : 'day', text : '日'},
            {code : 'month', text : '月'},
            {code : 'year', text : '年'},
            {code : 'range', text : '时间段'}
        ],
        listParams : [],
        distId : ''
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/list') {
                    let cacheValue = cache.getItem('list');
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
            const { 
                namespace, annotation, author, searchParams, listParams 
            } = yield select(({list}) => list);
            const params = {
                namespace : namespace,
                annotation : annotation,
                author : author,
                searchParams : searchParams,
                listParams : listParams
            };
            const {data} = yield call(cliList, params);
            if(!!data && !data.result) {
                yield put({
                    type : 'updateState',
                    payload : {
                        distId : data.id
                    }
                })
            }
        }
    },

    reducers: {
        updateState(state,action){
            const { type } = action.payload;
            if(type !== 'init'){
                const cacheObj = _.cloneDeep({
                    ...state, 
                    ...action.payload
                });
                delete cacheObj.typeData;
                delete cacheObj.type;
                cache.setItem('list', JSON.stringify({...cacheObj}));
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
            cache.removeItem('list');
            return {
                ...state,
                ...action.payload
            }
        }
    }
};
