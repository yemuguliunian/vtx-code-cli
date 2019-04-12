import React from 'react';

import { <%= add.vtxUi.join(', ') %> } from 'vtx-ui';
<%_ if(add.vtxDateUi.length > 0) { _%>
const { <%= add.vtxDateUi.join(', ') %> } = VtxDate;
<% } %>
import { <%= add.antd.join(', ') %> } from 'antd';
<%_ if(add.existSelect) { _%>
const Option = Select.Option;
<%_ } _%>

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
        <% if (add.addParams.length < 7) { %>
        const { <%= add.addParams.join(', ') %>, updateItem }  = contentProps;
        <% } -%>
        <% if (add.addParams.length >= 7) { %>
        const {
        	<%_ chunk(add.addParams, 6).map((item, index) => { _%>
            <%= item.join(', ') %>,
        	<%_ }) _%>
            updateItem 
        } = contentProps;
        <% } -%>   
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
					<%_ add.parameters.forEach(function(item){ _%>
<%- include('../fragment/form', {...item, item, appliaction}); _%>
					<%_ }); _%>
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;