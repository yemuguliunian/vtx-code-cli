import React from 'react';
import { connect } from 'dva';
import styles from './Dto.less';

import { Page, Cell} from 'rc-layout';
import { Input, Button } from 'antd';

import Namespace from '../components/Namespace';

import { openWindow } from '../utils/tools.js';

function Empty({dispatch, empty}) {

	const {
		namespace, annotation, author, distId
	} = empty;

	const updateState = (obj) => {
		dispatch({
			type : 'empty/updateState',
			payload : {
				...obj
			}
		})
	}	

    return (
        <Page title="空模板" space={10}>
        	<h5>namespace</h5>
    		<Namespace 
                namespace={namespace}
                annotation={annotation}
                author={author}
                updateState={updateState}
            />
        	<div className={styles.space}></div>
        	<div className={styles.footer}>
        		<Button type="primary" ghost onClick={() => {
                    updateState({distId : ''});
                    dispatch({type : 'empty/cli'});
                }}>生成模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => openWindow(`/code/generator/view?id=${distId}`, distId)}
                >预览</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/file/downLoadZip?id=${distId}`)}
                >导出模板</Button>
        	</div>
        </Page>
    );
}

export default connect(
	({empty}) => ({empty})
)(Empty);
