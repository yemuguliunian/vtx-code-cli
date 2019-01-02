const fs = require('fs');  
const logger = require('../../../middleware/logger.js');

const { firstUpperCase } = require('../../util/vtxUtil.js');

const initView = require('./View.js');
const initADD = require('./ADD.js');
const initModal = require('./Modal.js');
const initRouter = require('./Router.js');

// new新增/查看文件
function writeAddFile (folder, body) {
	return new Promise(function( resolve, reject ){
		const { namespace, parameters } = body;
		const folderName = folder + '/' + namespace;
		fs.exists( folderName, function(exists) {
			// 不存在文件夹
			if(!exists) {
				// 创建目录
				fs.mkdir(folderName, function(err) {
					if(err) {
						logger.error(`error new [Folder] ${folderName}` + err);
					} else {
						logger.info(`success new [Folder] ${folderName}`);
						Promise.all([
							new Promise((resolve, reject) => {
								// ADD.js
								fs.writeFile(folderName + '/ADD.js', initADD(parameters, namespace), function(err){
								    if(err) {
								    	logger.error(`error new [File] ${folderName}/ADD.js` + err);
								    } else {
								    	logger.info(`success new [File] ${folderName}/ADD.js`);
								    	resolve(`new [File] ${folderName}/ADD.js`);
								    }
								});
							}),
							new Promise((resolve, reject) => {
								// View.js
								fs.writeFile(folderName + '/View.js', initView(parameters, namespace), function(err){
								    if(err) {
								    	logger.error(`error new [File] ${folderName}/View.js ` + err);
								    } else {
								    	logger.info(`success new [File] ${folderName}/View.js`);
								    	resolve(`new [File] ${folderName}/View.js`);
								    }
								});
							})
						]).then((result) => {
							resolve(`新增/查看文件cli成功`);
						})
					}
	            })
			}
		})
	})
}

// new CURD modal
function writeCModal(folder, body) {
	return new Promise(function( resolve, reject ) {
		let { namespace } = body;
		// modal文件名
		let modalFoler = `${namespace}M`;
		let modalFolerPath = `${folder}/${modalFoler}.js`;
		fs.writeFile(modalFolerPath, initModal(body), function(err){
		    if(err) {
		    	logger.error(`error new [File] ${modalFolerPath}` + err);
		    } else {
		    	logger.info(`success new [File] ${modalFolerPath}`);
		    	resolve(`new [File] ${modalFolerPath}`);
		    }
		});
	})
}

// new CURD router
function writeRouter(folder, body) {
	return new Promise(function( resolve, reject ) {
		let { namespace } = body;
		// modal文件名
		let modalFoler = `${firstUpperCase(namespace)}`;
		let modalFolerPath = `${folder}/${modalFoler}.js`;
		fs.writeFile(modalFolerPath, initRouter(body), function(err){
		    if(err) {
		    	logger.error(`error new [File] ${modalFolerPath}` + err);
		    } else {
		    	logger.info(`success new [File] ${modalFolerPath}`);
		    	resolve(`new [File] ${modalFolerPath}`);
		    }
		});
	})
}


module.exports = function initCurd({folder, body, resolve, reject}) {
	return Promise.all([
		writeAddFile(folder, body),
		writeCModal(folder, body),
		writeRouter(folder, body)
	]).then((result) => {
		const id = folder.split('/')[2];
		resolve({id : id, status : '1000'});
		logger.info('END init curd template');
	}).catch(() => {
		reject();
	});
}