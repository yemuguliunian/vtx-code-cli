import React from 'react';

import { VtxrouteList, Vtxroute, } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

	const { updateWindow, routeProps, contentProps } = props;
	<% if (route.listParams.length < 7) { %>
    const { <%= route.listParams.join(', ') %>, updateItem }  = contentProps;
    <% } -%>
    <% if (route.listParams.length >= 7) { %>
    const {
    	<%_ chunk(route.listParams, 6).map((item, index) => { _%>
        <%= item.join(', ') %>,
    	<%_ }) _%>
    } = contentProps;
    <% } -%>  
	return (
		<Vtxroute
			{...routeProps}
			footer={[
				<Button key="cancel" size="large" onClick={()=>{
					updateWindow(false);
				}}>取消</Button>
			]}
		>
			<VtxrouteList>
				<%_ route.listParams.forEach(function(item){ _%>
				<div
					data-routelist={{
					    layout: {type: 'text', name: '<%= item.title%>', width: 50, key: '<%= item.param%>'}
					}}
				>
					{<%= item.param%>}
				</div>
				<%_ }); _%>
			</VtxrouteList>
		</Vtxroute>
	)
}

export default View;