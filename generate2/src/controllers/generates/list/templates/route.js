/**
 * <%=annotation%>
 * author : vtx <%=author%>
 * createTime : <%=getTime()%>
 */
import React from 'react';
import { connect } from 'dva';

import { Page, Content,<% if(isExport) {%> BtnWrap,<% } %> TableWrap } from 'rc-layout';
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
<% } -%>

<%_ if(isView) { _%>
import ViewItem from '@components/<%=namespace%>/View';
<%_ } _%>

import { handleColumns<% if(isExport) {%>, renderColumnParam<% } %> } from '@utils/tools';
<%_ if(route.vtxDateUi.length > 0) { _%>
import { VtxTimeUtil } from '@utils/util';
<%_ } _%>

function <%=upperFirst(namespace)%>({ dispatch, <%=namespace%> }) {
	const {
		searchParams,<% if(isExport) {%> queryParams,<% } %>
        <%_ if(route.paramDatas.length > 0) { _%>
        <%= route.paramDatas.join(', ') %>,
        <%_ } _%>
		currentPage, pageSize, loading, dataSource, total,<% if(isExport) {%> selectedRowKeys,<% } %>
        <% if(isView) {%>viewItem,<% } %>
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

<%- include('../../commonFragment/dataGird.ejs', {listParams: route.listParams, type: route.type, isExport: route.isExport}); _%>
    
    <%_ if(isView) { _%>
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
    <%_ } _%>

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
                <%_ if(isExport) { _%>
                {/*按钮*/}
                <BtnWrap>
                    <VtxExport2 {...exportProps}/>
                </BtnWrap>
                <%_ } _%>
				<TableWrap<% if(isExport) { %> top={48}<% } %>>
					<VtxDatagrid {...vtxDatagridProps}/>
				</TableWrap>
			</Content>
            <%_ if(isView) { _%>
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
            <%_ } _%>
		</Page>
	)
}

export default connect(
	({<%=namespace%>}) => ({<%=namespace%>})
)(<%=upperFirst(namespace)%>);