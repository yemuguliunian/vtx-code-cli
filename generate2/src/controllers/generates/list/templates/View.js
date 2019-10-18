import React from 'react';

import { VtxModalList, VtxModal, } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

	const { updateWindow, routeProps, contentProps } = props;
	<% if (route.listParams.length < 7) { %>
    const { <%= route.listParams.map(item => item.param).join(', ') %>, updateItem }  = contentProps;
    <% } -%>
    <% if (route.listParams.length >= 7) { %>
    const {
    	<%_ chunk(route.listParams.map(item => item.param), 6).map((item, index) => { _%>
        <%= item.join(', ') %>,
    	<%_ }) _%>
    } = contentProps;
    <% } -%>  
	return (
		<VtxModal
			{...routeProps}
			footer={[
				<Button key="cancel" size="large" onClick={()=>{
					updateWindow(false);
				}}>取消</Button>
			]}
		>
			<VtxModalList>
				<%_ route.listParams.forEach(function(item){ _%>
				<div
					data-modallist={{
					    layout: {type: 'text', name: '<%= item.title%>', width: 50, key: '<%= item.param%>'}
					}}
				>
					{<%= item.param%>}
				</div>
				<%_ }); _%>
			</VtxModalList>
		</VtxModal>
	)
}

export default View;