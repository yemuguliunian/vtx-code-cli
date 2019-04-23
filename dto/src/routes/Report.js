import React from 'react';
import { connect } from 'dva';
import styles from './Dto.less';

import { Page, Cell} from 'rc-layout';
import { Input, Icon, Select, Button } from 'antd';
const Option = Select.Option;

import Namespace from '../components/Namespace';
import SearchParam from '../components/SearchParam';

import { openWindow } from '../utils/tools.js';

function Report({dispatch, report}) {

	const {
		namespace, annotation, author, searchParams, typeData, distId
	} = report;

	const updateState = (obj) => {
		dispatch({
			type : 'report/updateState',
			payload : {
				...obj
			}
		})
	}	

	// 改变查询参数
	const handleChangeSearchParam = (value, id, column) => {
		const newData = _.cloneDeep(searchParams);
		const target = newData.filter(item => id === item.id)[0];
		if (target) {
      		target[column] = value;
      		updateState({
      			searchParams : newData
      		})
    	}
	}

	// 删除查询参数
	const deleteSearchParam = (id) => {
		const newData = _.cloneDeep(searchParams);
		const target = newData.filter(item => id != item.id);
		updateState({
  			searchParams : target
  		})
	}

	let searchParamRender = searchParams.map((item, index) => {
		return (
            <SearchParam 
                key={item.id} 
                {...item} 
                typeData={typeData} 
                handleChangeSearchParam={handleChangeSearchParam} 
                deleteSearchParam={deleteSearchParam}
            />
        )
	})
    
    return (
        <Page title="报表" space={10}>
        	<h5>namespace</h5>
    		<Namespace 
                namespace={namespace}
                annotation={annotation}
                author={author}
                updateState={updateState}
            />
        	<h5>查询条件</h5>
    		<Button type="primary" icon="plus" onClick={() => dispatch({type : 'report/newSearchParam'})}>新增查询条件</Button>
    		{searchParamRender}
        	<div className={styles.space}></div>
        	<div className={styles.footer}>
        		<Button type="primary" ghost onClick={() => {
                    updateState({distId : ''});
                    dispatch({type : 'report/cli'})
                }}>生成模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => openWindow(`/code/generator/view?id=${distId}`, distId)}
                >预览</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/file/downLoadZip?id=${distId}`)}
                >导出模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/file/downLoadConfig?id=${distId}`)}
                >导出配置项</Button>
                <Button 
                    onClick={() => dispatch({type : 'report/clearCache'})}
                >清除缓存</Button>
        	</div>
        </Page>
    );
}

export default connect(
	({report}) => ({report})
)(Report);
