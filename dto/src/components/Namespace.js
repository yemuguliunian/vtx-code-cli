import React from 'react';

import { Cell} from 'rc-layout';
import { Input } from 'antd';

function Namespace(props) {
	
	const { 
		namespace, annotation, author,
		updateState 
	} = props;

	return (
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
	)
}

export default Namespace;