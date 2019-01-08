import { cliEmpty } from '../services/service';

export default {

    namespace: 'empty',

    state: {
        namespace : '', // namespace
        annotation : '', // 注释
        author : '', // 作者
        distId : ''
    },

    subscriptions: {
        setup({ dispatch, history }) {

        },
    },

    effects: {
        *cli({ payload }, { call, put, select }) {
            const { 
                namespace, annotation, author
            } = yield select(({empty}) => empty);
            const params = {
                namespace : namespace,
                annotation : annotation,
                author : author
            };
            const {data} = yield call(cliEmpty, params);
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
        }
    }
};
