/**
 * <%=annotation%>
 * author : vtx <%=author%>
 * createTime : <%=getTime()%>
 */
import React from 'react';
import { connect } from 'dva';

import { Page, Content, TableWrap } from 'rc-layout';
import { <%= route.vtxUi.join(', ') %> } from 'vtx-ui';
<%_ if(route.vtxDateUi.length > 0) { _%>
const { <%= route.vtxDateUi.join(', ') %> } = VtxDate;
<% } %>
import { <%= route.antd.join(', ') %> } from 'antd';
<%_ if(route.existSelect) { _%>
const Option = Select.Option;
<% } -%>

import { handleColumns } from '../../utils/tools';
<%_ if(route.vtxDateUi.length > 0) { _%>
import { VtxTimeUtil } from '../../utils/util';
<%_ } _%>

function <%=upperFirst(namespace)%>({ dispatch, <%=namespace%> }) {
	const {
		searchParams,
        <%_ if(route.paramDatas.length > 0) { _%>
        <%= route.paramDatas.join(', ') %>,
        <%_ } _%>
		currentPage, pageSize, loading, dataSource, total
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

<%- include('../../commonFragment/dataGird.ejs', {listParams: route.listParams, type: route.type}); _%>
    
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
				<TableWrap>
					<VtxDatagrid {...vtxDatagridProps}/>
				</TableWrap>
			</Content>
		</Page>
	)
}

export default connect(
	({<%=namespace%>}) => ({<%=namespace%>})
)(<%=upperFirst(namespace)%>);