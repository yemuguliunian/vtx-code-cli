import React from 'react';

import { <%= add.vtxUi.join(', ') %> } from 'vtx-ui';
<% if(add.vtxDateUi.length > 0) { %>
const { <%= add.vtxDateUi.join(', ') %> } = VtxDate;
<% } %>
import { <%= add.antd.join(', ') %> } from 'antd';
<% if(add.existSelect) { %>
const Option = Select.Option;
<% } %>

class ADD extends React.Component {

	constructor(props) {
		super(props); ,

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
            <Button key='cancel' size='large' onClick={()=>{
                updateWindow(false);
            }}>取消</Button>,
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>保存</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { updateItem } = contentProps;

        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                	
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;