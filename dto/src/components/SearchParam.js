import React from 'react';

import { Cell} from 'rc-layout';
import { Input, Icon, Select, Button } from 'antd';
const Option = Select.Option;

function SearchParam(props) {

	const { 
		typeData,
		title, id, param, param1, type, gird, dataSourceParam, 
		handleChangeSearchParam, deleteSearchParam 
	} = props;
	
	return (
		<Cell>
            <Cell.Item>
                <Cell.Item.Title>
                    类型：
                </Cell.Item.Title>
                <Cell.Item.Body>
                    <Select style={{width : '100px'}} value={type} onChange={(value) => handleChangeSearchParam(value, id, 'type')}>
                        {typeData.map(item=> {
                            return <Option key={item.code}>{item.text}</Option>
                        })}
                    </Select>
                </Cell.Item.Body>
            </Cell.Item>
			<Cell.Item>
				<Cell.Item.Title>
					标题：
				</Cell.Item.Title>
				<Cell.Item.Body>
					<Input value={title} style={{width : '120px'}} onChange={(e) => handleChangeSearchParam(e.target.value, id, 'title')}/>
				</Cell.Item.Body>
			</Cell.Item>
			<Cell.Item>
				<Cell.Item.Title>
					Param：
				</Cell.Item.Title>
				<Cell.Item.Body>
					<Input value={param} onChange={(e) => handleChangeSearchParam(e.target.value, id, 'param')}/>
				</Cell.Item.Body>
			</Cell.Item>
            {
                type === 'range' &&
                <Cell.Item>
                    <Cell.Item.Title>
                        Param1：
                    </Cell.Item.Title>
                    <Cell.Item.Body>
                        <Input value={param1} onChange={(e) => handleChangeSearchParam(e.target.value, id, 'param1')}/>
                    </Cell.Item.Body>
                </Cell.Item>
            }
			{
				type === 'select' &&
				<Cell.Item>
    				<Cell.Item.Title>
    					下拉数据源Param：
    				</Cell.Item.Title>
    				<Cell.Item.Body>
    					<Input value={dataSourceParam} onChange={(e) => handleChangeSearchParam(e.target.value, id, 'dataSourceParam')}/>
    				</Cell.Item.Body>
    			</Cell.Item>
			}
			<Cell.Item>
				<Cell.Item.Title>
					Gird：
				</Cell.Item.Title>
				<Cell.Item.Body>
					<Input value={gird} onChange={(e) => handleChangeSearchParam(e.target.value, id, 'gird')}/>
				</Cell.Item.Body>
			</Cell.Item>
			<Button type="danger" icon="minus" onClick={() => deleteSearchParam(id)}/>
		</Cell>
	)
}

export default SearchParam;