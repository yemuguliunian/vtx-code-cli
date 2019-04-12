const BasicGenerator = require('../../BasicGenerator.js');

const _ = require('lodash');

class Generator extends BasicGenerator {

    writing() {
        const { searchParams, parameters } = this.body;
        const add = getAddAndViewParams(parameters);

        this.writeFiles({
            context: {
                ...this.context,
                add
            },
            filterFiles: f => {
                return true;
            }
        });
    }
}

// 获取新增和查看参数
function getAddAndViewParams(parameters) {

    let newParameters = _.cloneDeep(parameters);

    let addParams = ['id'], // 新增参数
        vtxUi = ['VtxModal', 'VtxModalList'], // vtx-ui组件
        vtxDateUi = [], // 日期组件
        antd = ['Button'];
        viewParams = [], // 查看参数
        viewVtxUi = []; // 查看vtx-ui组件 

    let existInput = false, // 是否存在文本
        existSelect = false, // 是否存在下拉
        existTreeSelect = false, // 是否存在下拉树
        existDay = false, // 是否存在日刷选
        existMonth = false, // 是否存在月刷选
        existYear = false, // 是否存在年刷选
        existUpload = false; // 是否存在上传

    for(var i = newParameters.length - 1; i >= 0; i--) {

        const { 
            title, param, paramData, required, repeat, reg, width, type 
        } = newParameters[i];

        newParameters[i].required = required === '1';
        newParameters[i].repeat = repeat === '1';

        // 新增参数存储
        addParams.push(param);
        ['select', 'treeSelect'].indexOf(type) > -1 && addParams.push(paramData);

        // 查看参数存储
        viewParams.push(['select', 'treeSelect'].indexOf(type) > -1 ? paramStr : param);

        // 类型检测
        switch(type) {
            case 'text' : // 文本
                !existInput && (existInput = true);
            break;
            case 'textarea' : // 文本域
                !existInput && (existInput = true);
            break;
            case 'select' : // 下拉选
                !existSelect && (existSelect = true);
            break;
            case 'treeSelect' : // 下拉树
                !existTreeSelect && (existTreeSelect = true);
            break;
            case 'day' : // 日刷选
                !existDay && (existDay = true);
            break;
            case 'month' : // 月刷选
                !existMonth && (existMonth = true);
            break;
            case 'year' : // 年刷选
                !existYear && (existYear = true);
            break;
            case 'upload' : // 上传
                !existUpload && (existUpload = true);
            break;
            default : 
                // 无逻辑
            break;
        }
    }

    // 存在文本
    existInput && antd.push('Input');
    // 存在下拉
    existSelect && antd.push('Select');
    // 若存在下拉树
    existTreeSelect && vtxUi.push('VtxTreeSelect');
    // 存在上传
    if(existUpload) {
        vtxUi.push('VtxUpload2');
        antd.push('message');
        viewVtxUi.push('VtxUpload2');
    }
    if(existDay || existMonth || existYear) {
        vtxUi.push('VtxDate');
        // 存在日刷选
        existDay && vtxDateUi.push('VtxDatePicker');
        // 存在月刷选
        existMonth && vtxDateUi.push('VtxMonthPicker');
        // 存在年刷选
        existYear && vtxDateUi.push('VtxYearPicker');
    }

    // 去重, 对象属性若存在重复在IE严格模式下报错
    addParams = _.uniq(addParams);
    
    return {
        add : {
            addParams, vtxUi, vtxDateUi, antd, existSelect, parameters : newParameters.reverse()
        },
        view : {
            viewParams, vtxUi : viewVtxUi, parameters : newParameters.reverse()
        }
    }
}

module.exports = Generator;
