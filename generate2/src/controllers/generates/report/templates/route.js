/**
 * <%=annotation%>
 * author : vtx <%=author%>
 * createTime : <%=getTime()%>
 */
import React from 'react';
import { connect } from 'dva';

import { Page, Content } from 'rc-layout';
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
		reportFlag
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
            updateState({
                reportFlag: new Date().getTime()
            })
        },

        clear() {
            dispatch({type : '<%=namespace%>/initQueryParams'});
            updateState({
                reportFlag: new Date().getTime()
            })
        }
    };
    <%_ } _%>

    const rpsProps = {
        report_code: '',
        report_param : {
            date: '',
            title: <%=annotation%>
        },
        data_param: {
            ...searchParams,
            tenantId: '',
            userId: '',
        },
        tenantId: '',
        flag: reportFlag,
    }
    
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
			<Content top={48}>
                <VtxRpsFrame {...rpsProps}/>
            </Content>
		</Page>
	)
}

export default connect(
    ({<%=namespace%>}) => ({<%=namespace%>})
)(<%=upperFirst(namespace)%>);
