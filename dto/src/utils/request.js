/**
 * http请求封装
 * autor : vortex gjh
 */
import fetch from 'dva/fetch';
import queryString from 'query-string';
import { message } from "antd";
const comm = {
    vtxInfo : {
        userId : '111',
        tenantId : '111',
        token : '111'
    }
};

//检测response数据，返回data
export const httpLoad = (res) => {
    if(res){
        if(res.result === 0){
            return {data : res};
        }else{
            message.error(res.msg || '请求信息错误');
        }
    }else{
        message.error("请求数据失败，请刷新重试！");
    }
    return false;
};

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

function hint(response) {
    if(response) {
        switch(response.status) {
            case 404 : 
                message.error(`接口请求不存在！错误码【404】。`);
                break;
            case 500 : 
                message.error(`服务端应用接口异常！错误码【500】。`);
                break;
            default :
                message.error(`请求错误，请检查或刷新重试！`);
                break;
        }
    }
    
}

class HttpService {

    /**
     * Requests a URL, returning a promise.
     * @param  {string} url       The URL we want to request
     * @param  {object} [options] The options we want to pass to "fetch"
     * @return {object}           An object containing either "data" or "err"
     */
    static get(url, options) {
        let { 
            headers = {
                'Accept': 'application/json,text/plain,*/*', 
                'Authorization':'Bearer '+ comm.vtxInfo.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Cache-Control' : 'no-cache'
            },
            body = {},
            isUserId,
            isTenantId = true
        } = options;
        let optionsClone = {
            headers,
            ...options,
            method : 'get'
        };

        let vtxInfo = [], paramStrs = [], params = [];
        if(isUserId) {
            vtxInfo.push(`userId=${comm.vtxInfo.userId}`);
        }
        if(isTenantId) {
            vtxInfo.push(`tenantId=${comm.vtxInfo.tenantId}`);
        }
        if(_.isObject(optionsClone.body)) {
            paramStrs = _.keys(optionsClone.body).map(item => {
                return `${item}=${optionsClone.body[item] || ''}`;
            })
        }
        params = _.concat(vtxInfo, paramStrs, [`_t=${new Date().valueOf()}`]);
        let urlA = `${url}?${params.join('&')}`;

        delete optionsClone.body;
        return fetch(urlA, optionsClone)
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => { return httpLoad(data); })
            .catch((err) => { 
                hint(err.response);
                return {data:null};
            });
    }

    /**
     * post请求
     * 两种请求方式
     * 第一种：body传系列化对象JSON.stringify()
     * 第二种：body传对象{}，请求方式是formData
     */
    static post(url, options) {
        let { 
            body = {},
            isUserId,
            isTenantId = true
        } = options;

        let vtxInfo = [], params = [];
        if(isUserId) {
            vtxInfo.push(`userId=${comm.vtxInfo.userId}`);
        }
        if(isTenantId) {
            vtxInfo.push(`tenantId=${comm.vtxInfo.tenantId}`);
        }
        params = _.concat(vtxInfo, [`_t=${new Date().valueOf()}`]);
        let urlA = `${url}?${params.join('&')}`;

        let bodyClone = _.cloneDeep(body);
        if(_.isObject(bodyClone)) {
            bodyClone = queryString.stringify(bodyClone);
        }
        let optionsClone = {
            headers : {
                'Accept': 'application/json,text/plain,*/*', 
                'Authorization':'Bearer '+ comm.vtxInfo.token,
                'Content-Type': `${_.isObject(body) ? 'application/x-www-form-urlencoded;' : 'application/json;'}charset=UTF-8`,
                'Cache-Control' : 'no-cache'
            },
            ...options,
            body : bodyClone,
            method : 'post'
        };
        return fetch(urlA, optionsClone)
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => { return httpLoad(data); })
            .catch((err) => { 
                hint(err.response);
                return {data:null};
            });
    }
}

export default HttpService;