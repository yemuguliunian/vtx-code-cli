import React from 'react';
import { connect } from 'dva';
import styles from './Dto.less';

import { Page, Cell} from 'rc-layout';
import { Input, Icon, Select, Button } from 'antd';
const Option = Select.Option;

import Namespace from '../components/Namespace';
import SearchParam from '../components/SearchParam';
import Parameter from '../components/Parameter';
import ListParam from '../components/ListParam';

function Curd({dispatch, curd}) {

	const {
		namespace, annotation, author, searchParams, typeData, 
        parameters, parameterTypeData, listParams, distId
	} = curd;

	const updateState = (obj) => {
		dispatch({
			type : 'curd/updateState',
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

	// 改变新增参数
	const handleChangeParameter = (value, id, column) => {
		const newData = _.cloneDeep(parameters);
		const target = newData.filter(item => id === item.id)[0];
		if (target) {
      		target[column] = value;
      		updateState({
      			parameters : newData
      		})
    	}
	}

	// 删除新增参数
	const deleteParameter = (id) => {
		const newData = _.cloneDeep(parameters);
		const target = newData.filter(item => id != item.id);
		updateState({
  			parameters : target
  		})
	}

	let parameterRender = parameters.map((item, index) => {
		return (
            <Parameter 
                key={item.id}
                {...item}
                parameterTypeData={parameterTypeData}
                handleChangeParameter={handleChangeParameter}
                deleteParameter={deleteParameter}
            />
        )
	})

	// 改变新增参数
	const handleChangeListParam = (value, id, column) => {
		const newData = _.cloneDeep(listParams);
		const target = newData.filter(item => id === item.id)[0];
		if (target) {
      		target[column] = value;
      		updateState({
      			listParams : newData
      		})
    	}
	}

	// 删除新增参数
	const deleteListParam = (id) => {
		const newData = _.cloneDeep(listParams);
		const target = newData.filter(item => id != item.id);
		updateState({
  			listParams : target
  		})
	}

	let listParamRender = listParams.map((item, index) => {
		return (
			<ListParam
                key={item.id}
                {...item}
                handleChangeListParam={handleChangeListParam}
                deleteListParam={deleteListParam}
            />
		)
	})

    return (
        <Page title="实例" space={10}>
        	<h5>namespace</h5>
            <Namespace 
                namespace={namespace}
                annotation={annotation}
                author={author}
                updateState={updateState}
            />
        	<h5>查询条件</h5>
    		<Button type="primary" icon="plus" onClick={() => dispatch({type : 'curd/newSearchParam'})}>新增查询条件</Button>
    		{searchParamRender}
            <h5>列表显示</h5>
            <Button type="primary" icon="plus" onClick={() => dispatch({type : 'curd/newListParams'})}>新增列表字段</Button>
            {listParamRender}
        	<h5>新增参数</h5>
    		<Button type="primary" icon="plus" onClick={() => dispatch({type : 'curd/newParameter'})}>新增字段</Button>
    		{parameterRender}
        	<div className={styles.space}></div>
        	<div className={styles.footer}>
        		<Button type="primary" ghost onClick={() => {
                    updateState({distId : ''});
                    dispatch({type : 'curd/cli'});
                }}>生成模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/file/downLoadZip?id=${distId}`)}
                >导出模板</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/view?id=${distId}`)}
                >预览</Button>
                <Button 
                    onClick={() => dispatch({type : 'curd/clearCache'})}
                >清除缓存</Button>
                <Button 
                    disabled={!distId}
                    onClick={() => window.open(`/code/generator/file/downLoadConfig?id=${distId}`)}
                >导出配置项</Button>
        	</div>
        </Page>
    );
}

export default connect(
	({curd}) => ({curd})
)(Curd);
