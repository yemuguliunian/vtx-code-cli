/**
 * 新增
 */
const vtxUtil = require('../../util/vtxUtil.js');
const indent = vtxUtil.indent;

const _dataML = Symbol('dataML');
const _isRequired = Symbol('isRequired');
const _isRepeat = Symbol('isRepeat');

class ADDCell {

	constructor() { 
		// 类型
		this.type = '';
		// 标题
		this.title = '';
		// Param
		this.param = '';
		// Param数据源
		this.paramData = '';
		// 是否必填项 0 不必填 1 必填
		this.required = '1';
		// 是否验重 0 不验重 1 验重
		this.repeat = '0';
		// 正则验证
		this.reg = '';
		// width
		this.width = '';
		// 缩进位数
		this.indentNum = 0;
	}

	get getType() {
		return this.type;
	}
	set setType(type) {
		this.type = type;
	}
	get getTitle() {
		return this.title;
	}
	set setTitle(title) {
		this.title = title;
	}
	get getParam() {
		return this.param;
	}
	set setParam(param) {
		this.param = param;
	}
	get getParamData() {
		return this.paramData;
	}
	set setParamData(paramData) {
		this.paramData = paramData;
	}
	get getRequired() {
		return this.required;
	}
	set setRequired(required) {
		this.required = required;
	}
	get getRepeat() {
		return this.repeat;
	}
	set setRepeat(repeat) {
		this.repeat = repeat;
	}
	get getReg() {
		return this.reg;
	}
	set setReg(reg) {
		this.reg = reg;
	}
	get getWidth() {
		return this.width;
	}
	set setWidth(width) {
		this.width = width;
	}
	get getIndentNum() {
		return this.indentNum;
	}
	set setIndentNum(indentNum) {
		this.indentNum = indentNum;
	}

	// 是否必填项
	[_isRequired]() {
		return this.required === '1';
	}

	// 是否验重
	[_isRepeat]() {
		return this.repeat === '1';
	}

	// data-modallist配置项（私有方法，外部不可调用）
	[_dataML]() {
		const _t = this;
		let fragment = [],
			requireFragment = [], // 是否必填项
			repeatFragment = [], // 是否验重
			regexpValue = ''; // regexp传值

		// 必填项设置
		this[_isRequired]() && (requireFragment = [`        require: true,`]);
		// 验重设置
		this[_isRepeat]() && (repeatFragment = [
			`        repete : {`,
			`            url : '' // 验重地址,`,
			`            key : {`,
			`                id : id,`,
			`                paramCode : '${this.param}',`,
			`                paramValue : ${this.param},`,
			`                tenantId : vtxInfo.tenantId // 租户信息`,
			`            }`,
			`        }`,
		]);
		// regexp传值
		regexpValue = ['treeSelect', 'upload'].indexOf(_t.type) > -1 ? `${this.param}.length > 0 ? '1' : ''` : `${this.param}`;

		// data-modallist代码片段
		fragment = [
			`data-modallist={{`,
			`    layout:{`,
			`        comType: 'input',`,
			         ...requireFragment,
	        `        name: '${this.title}',`,
	        `        width: '${this.width}',`,
	        		 ...(this.type === 'textarea' ? [`        maxNum: ${_config.inputArea_Num}`] : []),
	        `        key: '${this.param}'`,
			`    }`,
			`    regexp : {`,
			`         value : ${regexpValue}${this[_isRepeat]() ? ',' : ''}`,
			          ...repeatFragment,
			`    }`,
			`}}`
		];
		return fragment.map(item => `${indent(4)}${item}`);
	}

	// 文本
	get inputTemplate() {
		const _t = this;
		let fragment = [], // 文本代码片段
			eventFragment = []; // change合成事件代码片段

		eventFragment = [
			`        updateItem({`,
			`            ${this.param} : e.target.value`,
			`        })`
		];
		// 正则
		switch(this.reg) {
			case 'num' : // 正整数
				eventFragment = [
					`        if(!e.target.value || /^\d+$/.test(e.target.value)) {`,
					             ...eventFragment.map(item => `${indent(4)}${item}`),
	             	`        }`
				];
			break;
			default :
				// 无任何操作
			break;
		}

		// 文本代码片段
		fragment = [
			`<Input`,
			`    value={${this.param}}`,
			`    onChange={(e) => {`,
			         ...eventFragment,
	        `    }}`,
	        `    placeholder="请输入${this.title}${this[_isRequired]() ? '（必填项）' : ''}"`,
	        `    maxLength="${_config.input_len}"`,
	             ...this[_dataML](),
        	`/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 文本域
	get inputAreaTemplate() {
		const _t = this;
		// 文本域代码片段
		let fragment = [
			`<Input`,
			`    value={${this.param}}`,
			`    rows={${_config.inputArea_row}}`,
			`    type='textarea'`,
			`    onChange={(e) => {`,
			`        updateItem({`,
			`            ${this.param} : e.target.value`,
			`        })`,
	        `    }}`,
	        `    placeholder="请输入${this.title}${this[_isRequired]() ? '（必填项）' : ''}"`,
	        `    maxLength="${_config.input_len}"`,
	             ...this[_dataML](),
        	`/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 下拉选
	get selectTemplate() {
		const _t = this;
		// 下拉选代码片段
		let fragment = [
			`<Select`,
			`    value={${this.param}}`,
			`    onChange={(value) => {`,
			`        updateItem({`,
			`            ${this.param} : value`,
			`        })`,
	        `    }}`,
	        `    placeholder="请选择${this.title}${this[_isRequired]() ? '（必选项）' : ''}"`,
	        `    allowClear`,
	             ...this[_dataML](),
        	`>`,
        	`    {${this.paramData}.map(item => {`,
    		`        return <Option key={item.id}>{item.name}</Option>`,
    		`    }) }`,
			`</Select>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 下拉树
	get selectTreeTemplate() {
		const _t = this;
		// 下拉树代码片段
		let fragment = [
			`<VtxTreeSelect`,
			`    value={${this.param}}`,
			`    data={${this.paramData}}`,
			`    multiple`,
			`    treeCheckable`,
			`    treeDefaultExpandAll`,
			`    onChange={({allValue, allLabel, value, label})=>{`,
			`        updateItem({`,
			`            ${this.param} : value`,
			`        });`,
			`    }}`,
			`    placeholder="请选择${this.title}${this[_isRequired]() ? '（必选项）' : ''}"`,
			`    allowClear`,
			     ...this[_dataML](),
		    `/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 日刷选
	get dateTemplate() {
		const _t = this;
		// 日刷选代码片段
		let fragment = [
			`<VtxDatePicker`,
			`    value={${this.param}}`,
			`    onChange={(date, dateString) => {`,
			`        updateItem({`,
			`            ${this.param} : dateString`,
			`        });`,
			`    }}`,
			`    showTime`,
			`    format='YYYY-MM-DD HH:mm:ss'`,
			     ...this[_dataML](),
		    `/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 月刷选
	get monthTemplate() {
		const _t = this;
		// 月刷选代码片段
		let fragment = [
			`<VtxMonthPicker`,
			`    value={${this.param}}`,
			`    onChange={(date, dateString) => {`,
			`        updateItem({`,
			`            ${this.param} : dateString`,
			`        });`,
			`    }}`,
			`    showTime`,
			`    format='YYYY-MM'`,
			     ...this[_dataML](),
		    `/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 年刷选
	get yearTemplate() {
		const _t = this;
		// 年刷选代码片段
		let fragment = [
			`<VtxYearPicker`,
			`    value={${this.param}}`,
			`    onChange={(date, dateString) => {`,
			`        updateItem({`,
			`            ${this.param} : dateString`,
			`        });`,
			`    }}`,
			`    showTime`,
			`    format='YYYY'`,
			     ...this[_dataML](),
		    `/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}

	// 附件
	get uploadTemplate() {
		const _t = this;
		// 附件代码片段
		let fragment = [
			`<VtxUpload2`,
			`    fileList={${this.param}}`,
			`    mode='multiple'`,
			`    action='/cloudFile/common/uploadFile'`,
			`    downLoadURL='/cloudFile/common/downloadFile?id='`,
			`    disabled={false}`,
			`    multiple={true}`,
			`    showUploadList`,
			`    onSuccess={(file) => {`,
			"        message.info(`${file.name} 上传成功.`);",
			`        ${this.param}.push({`,
			`            id : file.id,`,
			`            name : file.name`,
			`        });`,
			`        updateItem({`,
			`            ${this.param}: ${this.param}`,
			`        });`,
			`    }}`,
			`    onError={(file) => {`,
			"        message.info(`${file.name} 上传失败.`);",
			`    }}`,
			`    onRemove={(file) => {`,
			`        let files = ${this.param}.filter(item => item.id != file.id);`,
			`        updateItem({${this.param} : files});`,
			`    }}`,
			     ...this[_dataML](),
		    `/>`
		];
		return fragment.map(item => `${indent(_t.indentNum)}${item}`);
	}
}

module.exports = ADDCell;