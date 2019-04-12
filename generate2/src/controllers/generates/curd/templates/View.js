import React from 'react';

import { VtxModalList, VtxModal, ${vtxUi.join(', ')} } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

	const { updateWindow, modalProps, contentProps } = props;

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

			</VtxModalList>
		</VtxModal>
	)
}

export default View;