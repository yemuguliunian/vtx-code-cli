import React from 'react';
import styles from './index.less';

function Loading(props) {

	const { loading } = props;

	let node = null;
	if(loading) {
		node = (
			<div className={styles.loading}>
				<div className={styles.tip}>正在生成模板</div>
			</div>
		)
	}

	return node;
}

export default Loading;