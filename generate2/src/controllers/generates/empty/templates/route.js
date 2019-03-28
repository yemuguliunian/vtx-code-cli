/**
 * <%=annotation%>
 * author : vtx <%=author%>
 * createTime : <%=getTime()%>
 */
import React from 'react';
import { connect } from 'dva';

import { Page } from 'rc-layout';

function <%=upperFirst(namespace)%>({ dispatch, <%=namespace%> }) {

	const {
		
	} = <%=namespace%>;

	const updateState = (obj) => {
		dispatch({
			type : '<%=namespace%>/updateState'
			payload : {...obj}
		})
	}

	return (
		<Page title="<%=annotation%>">
			
		</Page>
	)
}

export default connect(
    ({<%=namespace%>}) => ({<%=namespace%>})
)(<%=upperFirst(namespace)%>);