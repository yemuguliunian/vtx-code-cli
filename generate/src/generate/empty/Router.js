/**
 * 空模板 router
 */
const { firstUpperCase } = require('../../util/vtxUtil.js');
const moment = require('moment');

function initRouter(body) { 

	const { namespace, annotation, author } = body;

	fragment = [
		`/**`,
		` * ${annotation}`,
		` * author : vtx ${author}`,
		` * createTime : ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
		` */`,
		`import React from 'react';`,
		`import { connect } from 'dva';`,
		``,
		`import { Page } from 'rc-layout';`,
		``,
		`function ${firstUpperCase(namespace)}({ dispatch, ${namespace} }) {`,
		``,
		`	const {`,
		`		`,
		`	} = ${namespace};`,
		``,
		`	const updateState = (obj) => {`,
		`		dispatch({`,
		`			type : '${namespace}/updateState',`,
		`			payload : {...obj}`,
		`		})`,
		`	}`,
		``,
		`	return (`,
		`		<Page title="${annotation}">`,
		``,			
		`		</Page>`,
		`	)`,
		`}`,
		``,
		`export default connect(`,
		`    ({${namespace}}) => ({${namespace}})`,
		`)(${firstUpperCase(namespace)});`
	];

	return fragment.join('\n');
}

module.exports = initRouter;