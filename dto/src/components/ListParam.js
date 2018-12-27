import React from 'react';

import { Cell} from 'rc-layout';
import { Input, Icon, Select, Button } from 'antd';
const Option = Select.Option;

function ListParam(props) {
	
	const { 
		id, title, param,
		handleChangeListParam, deleteListParam 
	} = props;

	return (
		<Cell>
			<Cell.Item>
				<Cell.Item.Title>
					字段：
				</Cell.Item.Title>
				<Cell.Item.Body>
					<Input value={title} onChange={(e) => handleChangeListParam(e.target.value, id, 'title')}/>
				</Cell.Item.Body>
			</Cell.Item>
			<Cell.Item>
				<Cell.Item.Title>
					Param：
				</Cell.Item.Title>
				<Cell.Item.Body>
					<Input value={param} onChange={(e) => handleChangeListParam(e.target.value, id, 'param')}/>
				</Cell.Item.Body>
			</Cell.Item>
			<Button type="danger" icon="minus" onClick={() => deleteListParam(id)}/>
		</Cell>
	)
}

export default ListParam;