/**
 * <%=annotation%>
 * author : vtx <%=author%>
 * createTime : <%=getTime()%>
 */
import React from 'react';
import { connect } from 'dva';

import { Page, Content, BtnWrap, TableWrap } from 'rc-layout';
import { <%= route.vtxUi.join(', ') %> } from 'vtx-ui';
<%_ if(route.vtxDateUi.length > 0) { _%>
const { <%= route.vtxDateUi.join(', ') %> } = VtxDate;
<%_ } _%>
<%_ if(route.vtxUi.indexOf('VtxExport') > -1) { _%>
const { VtxExport2 } = VtxExport;
<% } %>
import { <%= route.antd.join(', ') %> } from 'antd';
<%_ if(route.existSelect) { _%>
const Option = Select.Option;
<%_ } _%>

import NewItem from '@components/<%=namespace%>/Add';
import EditItem from '@components/<%=namespace%>/Add';
import ViewItem from '@components/<%=namespace%>/View';

import { handleColumns<% if(isExport) {%>, renderColumnParam<% } %> } from '@utils/tools';
<%_ if(route.vtxDateUi.length > 0) { _%>
import { VtxTimeUtil } from '@utils/utils';
<%_ } _%>

function <%=upperFirst(namespace)%>({ dispatch, <%=namespace%> }) {
	const {
		searchParams,<% if(isExport) {%> queryParams,<% } %>
        <%_ if(route.paramDatas.length > 0) { _%>
        <%= route.paramDatas.join(', ') %>,
        <%_ } _%>
		currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
		newItem, editItem, viewItem
	} = <%=namespace%>;

	const updateState = (obj) => {
		dispatch({
			type: '<%=namespace%>/updateState',
			payload: {
				...obj
			}
		})
	}

    <%_ if(route.searchParams.length > 0) { _%>
    const getList = () => {
       dispatch({type: '<%=namespace%>/updateQueryParams'});
       dispatch({type: '<%=namespace%>/getList'});
    }

    const vtxGridParams = {
        <%_ route.searchParams.forEach(function(item){ _%>
<%- include('../../commonFragment/girdPropA.ejs', {...item}); _%>

        <%_ }); _%>
        query() {
            getList();
        },

        clear() {
            dispatch({type: '<%=namespace%>/initQueryParams'});
            dispatch({type: '<%=namespace%>/getList'});
        }
    };
    <%_ } _%>

<%- include('../../commonFragment/dataGird.ejs', {listParams : route.listParams, type : route.type}); _%>

	//----------------新增------------------
    const updateNewWindow = (status = true) => {
		updateState({
            newItem: {
                visible: status
            }
        })
    	if(!status) {
    		dispatch({ type: '<%=namespace%>/initNewItem' });
    	}
    }
    const newItemProps = {
    	updateWindow: updateNewWindow,
        modalProps:{
            title: '<%=annotation%> > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false), 
            width: 900
        },
        contentProps:{
            ...newItem,
            <%_ if(route.addParamsDatas.length > 0) { _%>
            <%= route.addParamsDatas.join(', ')%>,
            <%_ } _%>
            btnType: 'add',
            updateItem(obj) {
				updateState({
                    newItem : {
                        ...obj
                    }
                })
            },
            save() {
            	dispatch({type:'<%=namespace%>/saveOrUpdate', payload:{
					btnType: 'add',
                    onSuccess: function(){
                        message.success('新增成功');
                        updateNewWindow(false);
                    },
                    onError: function(){
                        message.error('新增失败');
                    }
                }})
            }
        }
    };
    
	//--------------编辑-----------------
    const updateEditWindow = (status = true) => {
		updateState({
            editItem : {
                visible : status
            }
        })
    }
    const editItemProps = {
    	updateWindow: updateEditWindow,
        modalProps: {
            title: '<%=annotation%> > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
        },
        contentProps:{
            ...editItem,
			<%_ if(route.addParamsDatas.length > 0) { _%>
            <%= route.addParamsDatas.join(', ')%>,
            <%_ } _%>
            btnType: 'edit',
            updateItem(obj) {
				updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save() {
            	dispatch({type: '<%=namespace%>/saveOrUpdate', payload: {
					btnType: 'edit',
                    onSuccess: function(){
                        message.success('编辑成功');
                        updateEditWindow(false);
                    },
                    onError: function(){
                        message.error('编辑失败');
                    }
                }})
            }
        }
    };
    
	//--------------查看-----------------
    const updateViewWindow = (status = true) => {
		updateState({
            viewItem: {
                visible: status
            }
        })
    }
    const viewItemProps = {
        updateWindow: updateViewWindow,
        modalProps: {
            title: '<%=annotation%> > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            btnType: 'view'
        }
    };
    
	//--------------删除------------------
    const deleteItems = () => {
    	Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({type:'<%=namespace%>/deleteItems',payload:{
                    ids: selectedRowKeys,
                    onSuccess: function(ids){
                    	let page = currentPage !=1 && ids.length === (total - (currentPage - 1)*pageSize) ?
                                currentPage - 1 : currentPage;
                        dispatch({
                            type: '<%=namespace%>/getList',
                            payload: {
                                selectedRowKeys: [],
                                currentPage: page
                            }
                        })
                        message.success('删除成功');
                    },
                    onError:function(msg){
                        message.error(msg);
                    }
                }});
            }
        });
    }

    <%_ if(isExport) { _%>
    // ---------------------------------导出-------------------------------
    const exportProps = {
        downloadURL: '',
        getExportParams(exportType){
            const commonParams = {
                userId, 
                tenantId, 
                ...queryParams,
                columnJson: renderColumnParam(columns),
                access_token: token
            };
            switch (exportType){
                case 'rows':
                    if(selectedRowKeys.length === 0){
                        message.warn('当前没有选中行');
                        return null;
                    }
                    return {
                        ...commonParams,
                        downloadAll: false,
                        ids: selectedRowKeys.join(','),
                    };
                break;
                case 'page':
                    if(dataSource.length === 0){
                        message.warn('当前页无数据');
                        return null;
                    }
                    return {
                        ...commonParams,
                        downloadAll: false,
                        ids: dataSource.map(item => item.id).join(',')
                    };
                break;
                case 'all':
                    if(total === 0){
                        message.warn('当前无数据');
                        return null;
                    }
                    return {
                        ...commonParams,
                        downloadAll: true
                    };
                break;
                default:
                    // 无逻辑
                break;
            }
        }
    };
    <%_ } _%>
    
	return (
		<Page title="<%=annotation%>">
            <%_ if(route.searchParams.length > 0) { _%>
            <VtxGrid
               titles={[<%- route.girdTitle.join(', ') %>]}
               gridweight={[<%= route.girdWidth.join(', ') %>]}
               confirm={vtxGridParams.query}
               clear={vtxGridParams.clear}
            >
                <%_ route.searchParams.forEach(function(item){ _%>
<%- include('../../commonFragment/girdChild.ejs', {...item}); _%>
                <%_ }); _%>
            </VtxGrid>
            <%_ } _%>
			<Content top={<%= searchParams.length > 0 ? 48 : 0 %>}>
				{/*按钮*/}
				<BtnWrap>
					<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>
					<Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>
                    <% if(isExport) { %><VtxExport2 {...exportProps}/><% } %>
				</BtnWrap>
				<TableWrap top={48}>
					<VtxDatagrid {...vtxDatagridProps}/>
				</TableWrap>
			</Content>
			{/*新增*/}
			{newItem.visible && <NewItem {...newItemProps}/>}
			{/*编辑*/}
			{editItem.visible && <EditItem {...editItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
		</Page>
	)
}

export default connect(
	({<%=namespace%>}) => ({<%=namespace%>})
)(<%=upperFirst(namespace)%>);