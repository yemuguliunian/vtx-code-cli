/**
 * <%=annotation%>
 * author : vtx <%=author%>
 * createTime : <%=getTime()%>
 */
import React from 'react';
import { connect } from 'dva';

import { Page, Report } from 'rc-layout';
import { <%= route.vtxUi.join(', ') %> } from 'vtx-ui';
<%_ if(route.vtxDateUi.length > 0) { _%>
const { <%= route.vtxDateUi.join(', ') %> } = VtxDate;
<% } %>
<%_ if(route.antd.length > 0) { _%>
import { <%= route.antd.join(', ') %> } from 'antd';
<%_ if(route.existSelect) { _%>
const Option = Select.Option;
<% } -%>
<% } -%>

<%_ if(route.vtxDateUi.length > 0) { _%>
import { VtxTimeUtil } from '../../utils/util';
<%_ } _%>

function <%=upperFirst(namespace)%>({ dispatch, <%=namespace%> }) {
	const {
		searchParams,
		<%_ if(route.paramDatas.length > 0) { _%>
        <%= route.paramDatas.join(', ') %>,
        <%_ } _%>
		iframeSrc
	} = <%=namespace%>;

	const updateState = (obj) => {
		dispatch({
			type : '<%=namespace%>/updateState',
			payload : {
				...obj
			}
		})
	}

	<%_ if(route.searchParams.length > 0) { _%>
    const vtxGridParams = {
        <%_ route.searchParams.forEach(function(item){ _%>
<%- include('../../commonFragment/girdPropB.ejs', {...item}); _%>

        <%_ }); _%>
        query() {
            dispatch({type : '<%=namespace%>/updateQueryParams'});
            dispatch({type : '<%=namespace%>/getUrl'});
        },

        clear() {
            dispatch({type : '<%=namespace%>/initQueryParams'});
            dispatch({type : '<%=namespace%>/getUrl'});;
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
			<Report src={iframeSrc} top={<%= searchParams.length > 0 ? 48 : 0 %>}/>
		</Page>
	)
}

export default connect(
    ({<%=namespace%>}) => ({<%=namespace%>})
)(<%=upperFirst(namespace)%>);
