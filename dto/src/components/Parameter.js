import React from 'react';

import { Cell} from 'rc-layout';
import { Input, Icon, Select, Button } from 'antd';
const Option = Select.Option;

function Parameter(props) {

	const { 
		parameterTypeData,
		id, title, param, paramStr, paramData, type, required, repeat, reg, width,
		handleChangeParameter, deleteParameter 
	} = props;
    
	return (
		<Cell>
            <Cell.Item>
                <Cell.Item.Title>
                    类型：
                </Cell.Item.Title>
                <Cell.Item.Body>
                    <Select style={{width : '100px'}} value={type} onChange={(value) => handleChangeParameter(value, id, 'type')}>
                        {parameterTypeData.map(item=> {
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
                    <Input value={title} style={{width : '100px'}} onChange={(e) => handleChangeParameter(e.target.value, id, 'title')}/>
                </Cell.Item.Body>
            </Cell.Item>
            <Cell.Item>
                <Cell.Item.Title>
                    Param：
                </Cell.Item.Title>
                <Cell.Item.Body>
                    <Input value={param} onChange={(e) => handleChangeParameter(e.target.value, id, 'param')}/>
                </Cell.Item.Body>
            </Cell.Item>
            {
                (type === 'select' || type === 'treeSelect') &&
                <Cell.Item>
                    <Cell.Item.Title>
                        ParamStr：
                    </Cell.Item.Title>
                    <Cell.Item.Body>
                        <Input value={paramStr} onChange={(e) => handleChangeParameter(e.target.value, id, 'paramStr')}/>
                    </Cell.Item.Body>
                </Cell.Item>
            }
			{
				(type === 'select' || type === 'treeSelect') &&
				<Cell.Item>
    				<Cell.Item.Title>
    					下拉数据源Param：
    				</Cell.Item.Title>
    				<Cell.Item.Body>
    					<Input style={{width : '120px'}} value={paramData} onChange={(e) => handleChangeParameter(e.target.value, id, 'paramData')}/>
    				</Cell.Item.Body>
    			</Cell.Item>
			}
            <Cell.Item>
                <Cell.Item.Title>
                    必填项：
                </Cell.Item.Title>
                <Cell.Item.Body>
                    <Select style={{width : '50px'}} value={required} onChange={(value) => handleChangeParameter(value, id, 'required')}>
                        <Option key={'1'}>是</Option>
                        <Option key={'0'}>否</Option>
                    </Select>
                </Cell.Item.Body>
            </Cell.Item>
            {
                type === 'text' &&
                <Cell.Item>
                    <Cell.Item.Title>
                        验重：
                    </Cell.Item.Title>
                    <Cell.Item.Body>
                        <Select style={{width : '50px'}} value={repeat} onChange={(value) => handleChangeParameter(value, id, 'repeat')}>
                            <Option key={'1'}>是</Option>
                            <Option key={'0'}>否</Option>
                        </Select>
                    </Cell.Item.Body>
                </Cell.Item>
            }
            {
                type === 'text' &&
                <Cell.Item>
                    <Cell.Item.Title>
                        正则验证：
                    </Cell.Item.Title>
                    <Cell.Item.Body>
                        <Select style={{width : '100px'}} value={reg} onChange={(value) => handleChangeParameter(value, id, 'reg')}>
                            <Option key={'num'}>正整数</Option>
                            <Option key={'phone'}>电话</Option>
                        </Select>
                    </Cell.Item.Body>
                </Cell.Item>
            }
            <Cell.Item>
                <Cell.Item.Title>
                    width：
                </Cell.Item.Title>
                <Cell.Item.Body>
                    <Input value={width} style={{width : '50px'}} onChange={(e) => handleChangeParameter(e.target.value, id, 'width')}/>
                </Cell.Item.Body>
            </Cell.Item>
			<Button type="danger" icon="minus" onClick={() => deleteParameter(id)}/>
		</Cell>
	)
}

export default Parameter;