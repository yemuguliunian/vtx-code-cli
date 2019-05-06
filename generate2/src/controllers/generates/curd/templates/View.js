import React from 'react';

import { VtxModalList, VtxModal, <%= view.vtxUi.join(', ') %> } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

	const { updateWindow, modalProps, contentProps } = props;
	<% if (view.viewParams.length < 7) { %>
    const { <%= view.viewParams.join(', ') %>, updateItem }  = contentProps;
    <% } -%>
    <% if (view.viewParams.length >= 7) { %>
    const {
    	<%_ chunk(view.viewParams, 6).map((item, index) => { _%>
        <%= item.join(', ') %>,
    	<%_ }) _%>
    } = contentProps;
    <% } -%>  
	return (
		<VtxModal
			{...modalProps}
			footer={[
				<Button key="cancel" size="large" onClick={()=>{
					updateWindow(false);
				}}>取消</Button>
			]}
		>
			<VtxModalList>
				<%_ view.parameters.forEach(function(item){ _%>
				<%_ if (item.type != 'upload') { _%>
				<div
					data-modallist={{
					    layout: {type: 'text', name: '<%= item.title%>', width: <%= item.width%>, key: '<%= item.param%>'}
					}}
				>{<%= item.param%>}</div>
				<%_ } _%>
				<%_ if (item.type === 'upload') { _%>
				<div
				    data-modallist={{
					    layout: {type: 'text', name: '<%= item.title%>', width: <%= item.width%>, key: '<%= item.param%>'}
					}}
				>
				    <VtxUpload2
				        showUploadList={true}
				        fileList={<%= item.param%>}
				        mode="multiple"
				        action="/cloudFile/common/uploadFile"
				        downLoadURL="/cloudFile/common/downloadFile?id="
				        viewMode={true}
				    />
				</div>
				<%_ } _%>
				<%_ }); _%>
			</VtxModalList>
		</VtxModal>
	)
}

export default View;