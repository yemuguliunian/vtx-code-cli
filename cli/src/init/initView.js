/**
 * 初始化查看模板
 */
const vtxUtil = require('../util/vtxUtil.js');
const split_array = vtxUtil.split_array;

const ViewCell = require('../template/ViewCell.js');
let vc = new ViewCell();

function initView(parameters) {
	
	let fragment = []; // 代码片段
	    viewParams = [], // 查看参数
	    viewParamsFragment = [], // 查看参数解析代码片段
	    modalList = [], // VtxModalList clildren
	    vtxUi = []; // vtx-ui组件
    let existUpload = false; // 是否存在附件上传

	// 遍历新增参数
	for(let i = parameters.length - 1; i >= 0; i--) {
		const { title, param, paramStr, width, type } = parameters[i];

		// ViewCell实例存值
		vc.setParam = ['select', 'treeSelect'].indexOf(type) > -1 ? paramStr : param;
		vc.setTitle = title;
		vc.setWidth = width;
		vc.setIndentNum = 16;

		// 查看参数存储
		viewParams.push(['select', 'treeSelect'].indexOf(type) > -1 ? paramStr : param);
		
		// 类型检测
		if(type === 'upload') {
			// 上传附件
			if(!existUpload) {
				existUpload = true;
			}
			modalList.push(...vc.uploadTemplate);
		} else {
			// 其它
			modalList.push(...vc.cellTemplate);
		}
	}

	// 若存在附件上传
	existUpload && vtxUi.push('VtxUpload2');

	// 查看参数props代码片段
	if(viewParams.length < _config.param_split_num) {
		// 若参数小于_config.param_split_num
		viewParamsFragment = [
			`    const { ${viewParams.join(', ')} } = contentProps`
		];
	} else {
		// 若参数大于_config.param_split_num 一维数组拆分2维数组，每个二维数组的最大长度为_config.param_split_num
		let splitArr = split_array(viewParams, _config.param_split_num);
		viewParamsFragment = splitArr.map((item, index) => {
			return `        ${item.join(', ')}${index === (splitArr.length-1) ? '' : ',' }`;
		})

		viewParamsFragment = [
			`    const {`,
			         ...viewParamsFragment,
			`    } = contentProps;`
		];
	}
	// 代码片段
	fragment = [
		`import React from 'react';`,
		``,
		`import { VtxModalList, VtxModal, ${vtxUi.join(', ')} } from 'vtx-ui';`,
		`import { Button } from 'antd';`,
		``,
		`function View(props) {`,
		``,
		`    const { updateWindow, modalProps, contentProps } = props;`,
			 ...viewParamsFragment,
		``,
		`    return (`,
		`        <VtxModal`,
		`            {...modalProps}`,
		`            footer={[`,
		`                <Button key="cancel" size="large" onClick={()=>{`,
		`                    updateWindow(false);`,
		`                }}>取消</Button>`,
		`            ]}`,
		`        >`,
		`            <VtxModalList>`,
						...modalList,
		`            </VtxModalList>`,
		`        </VtxModal>`,
		`    )`,
		`}`,
		``,
		`export default View;`
	];

	return fragment.join('\n');
}

module.exports = initView;