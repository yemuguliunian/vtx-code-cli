import { cliList } from '../services/service';

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
            return {
                ...state,
                ...action.payload
            }
        },

        newSearchParam(state, action) {
            const newData = _.cloneDeep(state.searchParams);
            const searchItem = {
                id : _.uniqueId('searchParam_'),
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
                id : _.uniqueId('parameter_'),
                title : '',
                param : '',
            };
            newData.unshift(listParam);
            return {
                ...state,
                listParams : newData
            }
        }
    }
};
