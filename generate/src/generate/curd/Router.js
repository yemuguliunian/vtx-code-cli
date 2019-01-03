/**
 * 初始化CURD router
 */
const { split_array, firstUpperCase, dedupe, indent } = require('../../util/vtxUtil.js');
const gc = require('../template/GirdCell');
const dg = require('../template/DataGird');

const moment = require('moment');

function initRouter(body) { 

	const { namespace, annotation, author, searchParams, parameters, listParams } = body;

	let fragment = [], // 代码片段
		girdParamFragment = [],
		girdFragment = [],
		dataGirdFragment = [];
		queryState = [], // 查询参数
		searchParamsDatas = [],
		addParamsDatas = [],
		paramDatas = [], // 数据来源
		girdTitle = [],
		girdWidth = [],
		girdParams = [],
		girdList = [], // gird children
		vtxUi = ['VtxDatagrid'], // vtx-ui组件
	    vtxDateUi = [], // 日期组件
		antd = ['Modal', 'message'];
	let existInput = false, // 是否存在文本
    	existSelect = false, // 是否存在下拉
    	existDay = false, // 是否存在日刷选
    	existMonth = false, // 是否存在月刷选
    	existYear = false, // 是否存在年刷选
    	existRange = false; // 是否存在时间段

	// 查询参数
	for(var i = searchParams.length - 1; i >= 0; i--) {
		const { title, param, param1, type, paramData, gird } = searchParams[i];

		gc.setType = type;
		gc.setTitle = title;
		gc.setParam = param;
		gc.setParam1 = param1;
		gc.setParamData = paramData;

		girdTitle.push(title);
		girdWidth.push(gird);

		paramData && searchParamsDatas.push(paramData);

		let props, render;
		// 类型检测
		switch(type) {
			case 'text' : // 文本
				!existInput && (existInput = true);
				props = gc.input.props;
				render = gc.input.render;
			break;
			case 'select' : // 下拉选
				!existSelect && (existSelect = true);
				props = gc.select.props;
				render = gc.select.render;
			break;
			case 'day' : // 日刷选
				!existDay && (existDay = true);
				props = gc.date.props;
				render = gc.date.render;
			break;
			case 'month' : // 月刷选
				!existMonth && (existMonth = true);
				props = gc.month.props;
				render = gc.month.render;
			break;
			case 'year' : // 年刷选
				!existYear && (existYear = true);
				props = gc.year.props;
				render = gc.year.render;
			break;
			case 'range' : // 时间段
				!existRange && (existRange = true);
				props = gc.range.props;
				render = gc.range.render;
			break;
			default : 
				// 无逻辑
			break;
		}
		girdParams.push(...[...props, '']);
		girdList.push(...render);
	}
	
	// 新增参数
	for(var i = parameters.length - 1; i >= 0; i--) {
		const { paramData } = parameters[i];
		paramData && addParamsDatas.push(paramData);
	}

	paramDatas = dedupe([...searchParamsDatas, ...addParamsDatas]);
	searchParams.length > 0 && vtxUi.push('VtxGrid');
	// 存在文本
	existInput && antd.push('Input');
	// 存在下拉
	existSelect && antd.push('Select');
	if(existDay || existMonth || existYear || existRange) {
		vtxUi.push('VtxDate');
		// 存在日刷选
		existDay && vtxDateUi.push('VtxDatePicker');
		// 存在月刷选
		existMonth && vtxDateUi.push('VtxMonthPicker');
		// 存在年刷选
		existYear && vtxDateUi.push('VtxYearPicker');
		// 时间段
		existRange && vtxDateUi.push('VtxRangePicker');
	}

	// 查询参数
	if(searchParams.length > 0) {
		girdParamFragment = [
			`// 更新表格数据`,
			`const getList = () => {`,
			`	dispatch({type : '${namespace}/updateQueryParams'});`,
			`	dispatch({type : '${namespace}/getList'});`,
			`}`,
			``,
			`// 查询`,
			`const vtxGridParams = {`,
				...girdParams,
			`	query() {`,
			`		getList();`,
			`	},`,
			``,
			`	clear() {`,
			`		dispatch({type : '${namespace}/initQueryParams'});`,
			`		dispatch({type : '${namespace}/getList'});`,
			`	}`,
			`};`
		];

		girdFragment = [
			`<VtxGrid`,
			`	titles={[${girdTitle.map(item => `'${item}'`).join(', ')}]}`,
            ` 	gridweight={[${girdWidth.join(', ')}]}`,
            ` 	confirm={vtxGridParams.query}`,
            ` 	clear={vtxGridParams.clear}`,
			`>`,
				...girdList,
			`</VtxGrid>`
		];
	}

	// 列表参数
	dg.setNamespace = namespace;
	dg.setType = 'curd';
	dg.setParams = listParams;
	dg.setIndentNum = 4;
	dataGirdFragment = dg.render;


	fragment = [
		`/**`,
		` * ${annotation}`,
		` * author : vtx ${author}`,
		` * createTime : ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
		` */`,
		`import React from 'react';`,
		`import { connect } from 'dva';`,
		``,
		`import { Page, Content, BtnWrap, Button, TableWrap } from '../../components/layout';`,
		`import { ${vtxUi.join(', ')} } from 'vtx-ui';`,
		...(vtxDateUi.length > 0 ? [`const { ${vtxDateUi.join(', ')} } = VtxDate;`] : []),
		`import { ${antd.join(', ')} } from 'antd';`,
		...(existSelect ? [`const Option = Select.Option;`] : []),
		``,
		`import NewItem from '../components/${namespace}/ADD';`,
		`import EditItem from '../components/${namespace}/ADD';`,
		`import ViewItem from '../components/${namespace}/View';`,
		``,
		`import { handleColumns } from '../../utils/tools';`,
		...(vtxDateUi.length > 0 ? [`import { VtxTimeUtil } from '../../utils/vtxUtil';`] : []),
		``,
		`function ${firstUpperCase(namespace)}({ dispatch, ${namespace} }) {`,
		`	const {`,
		`		searchParams,`,
				...(paramDatas.length > 0 ? [`        ${paramDatas.join(', ')},`] : []),
		`		currentPage, pageSize, loading, dataSource, total, selectedRowKeys,`,
		`		newItem, editItem, viewItem`,
		`	} = areaPopulation;`,
		``,
		`	const updateState = (obj) => {`,
		`		dispatch({`,
		`			type : '${namespace}/updateState',`,
		`			payload : {`,
		`				...obj`,
		`			}`,
		`		})`,
		`	}`,
		``,
		`	const updateSearchParams = (obj) => {`,
		`		dispatch({`,
		`			type : '${namespace}/updateSearchParams',`,
		`			payload : {`,
		`				...obj`,
		`			}`,
		`		})`,
		`	}`,
		``,
			...girdParamFragment.map(item => `${indent(4)}${item}`),
		``,
			...dataGirdFragment,
		``,
		`	//----------------新增------------------`,
		`    const updateNewWindow = (status = true) => {`,
		`    	if(!status) {`,
		`    		dispatch({ type : '${namespace}/initNewItem' });`,
		`    	}`,
		`    	dispatch({`,
		`    		type : '${namespace}/updateNewItem',`,
		`    		payload : {`,
		`    			visible : status`,
		`    		}`,
		`    	})`,
		`    }`,
		`    const newItemProps = {`,
		`    	updateWindow : updateNewWindow,`,
		`        modalProps:{`,
		`            title:'${annotation} > 新增',`,
		`            visible: newItem.visible,`,
		`            onCancel:() => updateNewWindow(false), `,
		`            width:900`,
		`        },`,
		`        contentProps:{`,
		`            ...newItem,`,
					 ...(addParamsDatas.length > 0 ? [`            ${addParamsDatas.join(',')},`] : []),
		`            btnType : 'add',`,
		`            updateItem(obj) {`,
		`            	dispatch({`,
		`            		type : '${namespace}/updateNewItem',`,
		`            		payload : {`,
		`            			...obj`,
		`            		}`,
		`            	})`,
		`            },`,
		`            save() {`,
		`            	dispatch({type:'${namespace}/saveOrUpdate',payload:{`,
        `					saveType : 'add',`,
		`                    onSuccess:function(){`,
		`                        message.success('新增成功');`,
		`                        updateNewWindow(false);`,
		`                    },`,
		`                    onError:function(){`,
		`                        message.error('新增失败');`,
		`                    }`,
		`                }})`,
		`            }`,
		`        }`,
		`    };`,
		`    `,
		`	//--------------编辑-----------------`,
		`    const updateEditWindow = (status = true) => {`,
		`    	dispatch({`,
		`    		type : '${namespace}/updateEditItem',`,
		`    		payload : {`,
		`    			visible : status`,
		`    		}`,
		`    	})`,
		`    }`,
		`    const editItemProps = {`,
		`    	updateWindow : updateEditWindow,`,
		`        modalProps:{`,
		`            title:'${annotation} > 编辑',`,
		`            visible: editItem.visible,`,
		`            onCancel:() => updateEditWindow(false),`,
		`            width:900`,
		`        },`,
		`        contentProps:{`,
		`            ...editItem,`,
					 ...(addParamsDatas.length > 0 ? [`            ${addParamsDatas.join(',')},`] : []),
		`            btnType : 'edit',`,
		`            updateItem(obj) {`,
		`            	dispatch({`,
		`            		type : '${namespace}/updateEditItem',`,
		`            		payload : {`,
		`            			...obj`,
		`            		}`,
		`            	})`,
		`            },`,
        `            save() {`,
		`            	dispatch({type:'${namespace}/saveOrUpdate',payload:{`,
        `					saveType : 'edit',`,
		`                    onSuccess:function(){`,
		`                        message.success('编辑成功');`,
		`                        updateEditWindow(false);`,
		`                    },`,
		`                    onError:function(){`,
		`                        message.error('编辑失败');`,
		`                    }`,
		`                }})`,
		`            }`,
		`        }`,
		`    };`,
		`    `,
		`	//--------------查看-----------------`,
		`    const updateViewWindow = (status = true) => {`,
		`        dispatch({`,
		`            type : '${namespace}/updateViewItem',`,
		`            payload : {`,
		`                visible : status`,
		`            }`,
		`        })`,
		`    }`,
		`    const viewItemProps = {`,
		`        updateWindow : updateViewWindow,`,
		`        modalProps:{`,
		`            title:'${annotation} > 查看',`,
		`            visible: viewItem.visible,`,
		`            onCancel:() => updateViewWindow(false),`,
		`            width:900`,
		`        },`,
		`        contentProps:{`,
		`            ...viewItem,`,
		`            btnType : 'view'`,
		`        }`,
		`    };`,
		`    `,
		`	//--------------删除------------------`,
		`    const deleteItems = () => {`,
		`    	Modal.confirm({`,
		'         content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,',
		`            okText: '确定',`,
		`            cancelText: '取消',`,
		`            onOk() {`,
		`                dispatch({type:'${namespace}/deleteItems',payload:{`,
		`                    ids : selectedRowKeys,`,
		`                    onSuccess:function(ids){`,
		`                    	let page = currentPage !=1 && ids.length === (total - (currentPage - 1)*pageSize) ?`,
		`                                currentPage - 1 : currentPage;`,
		`                        dispatch({`,
		`                            type:'${namespace}/getList',`,
		`                            payload : {`,
		`                                currentPage : page`,
		`                            }`,
		`                        }).then((status) => {`,
		`                            if(status) {`,
		`                                updateState({`,
		`                                    selectedRowKeys : [],`,
		`                                    currentPage : page`,
		`                                })`,
		`                            }`,
		`                        });`,
		`                        message.success('删除成功');`,
		`                    },`,
		`                    onError:function(msg){`,
		`                        message.error(msg);`,
		`                    }`,
		`                }});`,
		`            }`,
		`        });`,
		`    }`,
		`    `,
		`	return (`,
		`		<Page title="${annotation}">`,
					...girdFragment.map(item => `${indent(12)}${item}`),
		`			<Content top={${searchParams.length > 0 ? 48 : 0}}>`,
		`				{/*按钮*/}`,
		`				<BtnWrap>`,
		`					{ADD && <Button fType="add" onClick={() => updateNewWindow()}>新增</Button>}`,
		`					{DELETE && <Button disabled={selectedRowKeys.length == 0} fType="delete" onClick={deleteItems}>删除</Button>}`,
		`				</BtnWrap>`,
		`				<TableWrap top={48}>`,
		`					<VtxDatagrid {...vtxDatagridProps}/>`,
		`				</TableWrap>`,
		`			</Content>`,
		`			{/*新增*/}`,
		`			{newItem.visible && <NewItem {...newItemProps}/>}`,
		`			{/*编辑*/}`,
		`			{editItem.visible && <EditItem {...editItemProps}/>}`,
		`            {/*查看*/}`,
		`            {viewItem.visible && <ViewItem {...viewItemProps}/>}`,
		`		</Page>`,
		`	)`,
		`}`,
		``,
		`export default connect(`,
		`	({${namespace}}) => ({${namespace}})`,
		`)(${firstUpperCase(namespace)});`,

	];

	return fragment.join('\n');
}

module.exports = initRouter;