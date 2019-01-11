import React from 'react';
import { connect } from 'dva';
import styles from './Dto.less';

import { Page, Cell} from 'rc-layout';
import { Input, Button } from 'antd';

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
    		<Cell>
    			<Cell.Item>
    				<Cell.Item.Title>
    					namespace：
    				</Cell.Item.Title>
    				<Cell.Item.Body>
    					<Input value={namespace} onChange={(e) => updateState({namespace : e.target.value})}/>
    				</Cell.Item.Body>
    			</Cell.Item>
                <Cell.Item>
                    <Cell.Item.Title>
                        注释：
                    </Cell.Item.Title>
                    <Cell.Item.Body>
                        <Input value={annotation} onChange={(e) => updateState({annotation : e.target.value})}/>
                    </Cell.Item.Body>
                </Cell.Item>
                <Cell.Item>
                    <Cell.Item.Title>
                        作者：
                    </Cell.Item.Title>
                    <Cell.Item.Body>
                        <Input value={author} onChange={(e) => updateState({author : e.target.value})}/>
                    </Cell.Item.Body>
                </Cell.Item>
			</Cell>
        	<div className={styles.space}></div>
        	<div className={styles.footer}>
        		<Button type="primary" ghost onClick={() => dispatch({type : 'empty/cli'})}>生成模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/file/downLoadZip?id=${distId}`)}
                >导出模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/view?id=${distId}`)}
                >预览</Button>
        	</div>
        </Page>
    );
}

export default connect(
	({empty}) => ({empty})
)(Empty);
