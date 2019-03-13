/**
 * 初始化新增模板
 */
const vtxUtil = require('../../util/vtxUtil.js');
const split_array = vtxUtil.split_array;

const ADDCell = require('../template/ADDCell.js');
let ac = new ADDCell();

function initADD(parameters) {

	let fragment = [], // 代码片段
	    addParams = ['id'], // 新增参数
	    addParamsFragment = [], // 新增参数解析代码片段
	    modalList = [], // VtxModalList clildren
	    vtxUi = ['VtxModal', 'VtxModalList'], // vtx-ui组件
	    vtxDateUi = [], // 日期组件
	    antd = ['Button'];
    let existInput = false, // 是否存在文本
    	existSelect = false, // 是否存在下拉
    	existTreeSelect = false, // 是否存在下拉树
    	existDay = false, // 是否存在日刷选
    	existMonth = false, // 是否存在月刷选
    	existYear = false, // 是否存在年刷选
    	existUpload = false; // 是否存在上传

	for(var i = parameters.length - 1; i >= 0; i--) {

		const { 
			title, param, paramData, required, repeat, reg, width, type 
		} = parameters[i];

		// ADDCell实例存值
		ac.setType = type;
		ac.setTitle = title;
		ac.setParam = param;
		ac.setParamData = paramData;
		ac.setRequired = required;
		ac.setRepeat = repeat;
		ac.setReg = reg;
		ac.setWidth = width;
		ac.setIndentNum = 20;

		// 新增参数存储
		addParams.push(param);
		['select', 'treeSelect'].indexOf(type) > -1 && addParams.push(paramData);

		// 类型检测
		switch(type) {
			case 'text' : // 文本
				!existInput && (existInput = true);
				modalList.push(...ac.inputTemplate);
			break;
			case 'textarea' : // 文本域
				!existInput && (existInput = true);
				modalList.push(...ac.inputAreaTemplate);
			break;
			case 'select' : // 下拉选
				!existSelect && (existSelect = true);
				modalList.push(...ac.selectTemplate);
			break;
			case 'treeSelect' : // 下拉树
				!existTreeSelect && (existTreeSelect = true);
				modalList.push(...ac.selectTreeTemplate);
			break;
			case 'day' : // 日刷选
				!existDay && (existDay = true);
				modalList.push(...ac.dateTemplate);
			break;
			case 'month' : // 月刷选
				!existMonth && (existMonth = true);
				modalList.push(...ac.monthTemplate);
			break;
			case 'year' : // 年刷选
				!existYear && (existYear = true);
				modalList.push(...ac.yearTemplate);
			break;
			case 'upload' : // 上传
				!existUpload && (existUpload = true);
				modalList.push(...ac.uploadTemplate);
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
	existUpload && vtxUi.push('VtxUpload2');
	if(existDay || existMonth || existYear) {
		vtxUi.push('VtxDate');
		// 存在日刷选
		existDay && vtxDateUi.push('VtxDatePicker');
		// 存在月刷选
		existMonth && vtxDateUi.push('VtxMonthPicker');
		// 存在年刷选
		existYear && vtxDateUi.push('VtxYearPicker');
	}

	// addParams去重
	addParams = vtxUtil.dedupe(addParams);
	// 新增参数props代码片段
	if(addParams.length < _config.param_split_num) {
		// 若参数小于_config.param_split_num
		addParamsFragment = [
			`        const { ${addParams.join(', ')} } = contentProps`
		];
	} else {
		// 若参数大于_config.param_split_num 一维数组拆分2维数组，每个二维数组的最大长度为_config.param_split_num
		let splitArr = split_array(addParams, _config.param_split_num);
		addParamsFragment = splitArr.map((item, index) => {
			return `            ${item.join(', ')}${index === (splitArr.length-1) ? '' : ',' }`;
		})

		addParamsFragment = [
			`        const {`,
			             ...addParamsFragment,
			`        } = contentProps;`
		];
	}

	fragment = [
		`import React from 'react';`,
		``,
		`import { ${vtxUi.join(', ')} } from 'vtx-ui';`,
		...(vtxDateUi.length > 0 ? [`const { ${vtxDateUi.join(', ')} } = VtxDate;`] : []),
		`import { ${antd.join(', ')} } from 'antd';`,
		...(existSelect ? [`const Option = Select.Option;`] : []),
		``,
		`class ADD extends React.Component {`,
		``,
		`	constructor(props) {`,
		`		super(props);` ,
		``,
		`		this.state = {};`,
		`	}`,
		``,
		`    modalListRef = ref => this.modalList = ref;`,
		``,
		`    footerRender() {`,
		`        const { contentProps, updateWindow } = this.props;`,
		`        const { loading, save } = contentProps;`,
		`        const _t = this;`,
		`        return [`,
		`            <Button key='cancel' size='large' onClick={()=>{`,
		`                updateWindow(false);`,
		`            }}>取消</Button>,`,
		`            <Button key='submit' type='primary' size='large'`,
		`                loading={loading}`,
		`                onClick={()=>{`,
		`                    _t.modalList.submit().then((state) => {`,
		`                        state && save(); // 保存事件`,
		`                    })`,
		`                }`,
		`            }>保存</Button>`,
		`        ]`,
		`    }`,
		``,
		`    render() {`,
		`        const { dispatch, modalProps, contentProps } = this.props;`,
				 ...addParamsFragment,
		`        const { updateItem } = contentProps;`,
		``,
		`        return (`,
		`            <VtxModal`,
		`                {...modalProps}`,
		`                footer={this.footerRender()}`,
		`            >`,
		`                <VtxModalList`,
		`                    isRequired`,
		`                    visible={modalProps.visible}`,
		`                    ref={this.modalListRef}`,
		`                >`,
							 ...modalList,
		`                </VtxModalList>`,
		`            </VtxModal>`,
		`        )`,
		`    }`,
		`}`,
		``,
		`export default ADD;`
	];

    return fragment.join('\n');
}

module.exports = initADD;