const fs = require('fs');  
const logger = require('../../../middleware/logger.js');

const { firstUpperCase } = require('../../util/vtxUtil.js');

const initModal = require('./Modal.js');
const initRouter = require('./Router.js');

// new modal
function writeModal(folder, body) {
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

// new router
function writeRouter(folder, body) {
	return new Promise(function( resolve, reject ) {
		let { namespace } = body;
		// modal文件名
		let modalFoler = `${namespace}`;
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


module.exports = function initReport({folder, body, resolve, reject}) {
	return Promise.all([
		writeModal(folder, body),
		writeRouter(folder, body)
	]).then((result) => {
		const id = folder.split('/')[2];
		resolve({id : id, status : '1000'});
		logger.info('END init curd template');
	}).catch(() => {
		reject();
	});
}