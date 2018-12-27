const fs = require('fs');  
const path = require('path');  
const rimraf = require('rimraf');
const moment = require('moment');

const initView = require('./init/initView.js');
const initADD = require('./init/initADD.js');

const vtxUtil = require('./util/vtxUtil.js');
const messge = vtxUtil.messge;

// initFolder
const distFolderName = 'dist';

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
						console.log(err);
					} else {
						messge.success('new [Folder] '+folderName);
						Promise.all([
							new Promise((resolve, reject) => {
								// ADD.js
								fs.writeFile(folderName + '/ADD.js', initADD(parameters, namespace), function(err){
								    if(err) {
								    	console.log('new [File]ADD.js error')
								    } else {
								    	messge.success(`new [File] ${folderName}/ADD.js`);
								    	resolve(`new [File] ${folderName}/ADD.js`);
								    }
								});
							}),
							new Promise((resolve, reject) => {
								// View.js
								fs.writeFile(folderName + '/View.js', initView(parameters, namespace), function(err){
								    if(err) {
								    	console.log('new [File]View.js error')
								    } else {
								    	messge.success(`new [File] ${folderName}/View.js`);
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

// 新建模板，每个模板缓存一份，定期清理
function mkdirTemplate(folder, body, resolveCli) {
	return new Promise((resolve, reject) => {
		// 是否存在${folder}文件
		fs.exists( folder, function(exists) {
			// 已存在
			if(exists) {
				let strArr = folder.split('_');
				strArr[2] = String(parseInt(strArr[2] || '0') + 1);
				folder = strArr.join('_');
				// 若存在重新创建
				mkdirTemplate(folder, body, resolveCli);
			} else {
				fs.mkdir(folder, function(err) {
					if(err) {
						console.log(err);
					} else {
						messge.success('new [Folder] '+folder);
						writeAddFile(folder, body).then((result) => {
							const id = folder.split('/')[1];
							resolveCli({id : id, status : '1000'});
						});
					}
				})
			}
		})
	});
}

// cli初始
function cli(body) {
	return new Promise((resolve, reject) => {
		const { namespace } = body;
		// namespace未定义
		if(!namespace) {
			resolve({status : '1001'});
			return;
		}
		// 唯一标识 vtx__时间
	    const key = `vtx_${moment().format('YYYYMMDDHHmmss')}`;
		// 是否存在dist文件
		fs.exists( distFolderName, function(exists) {
			// 以id作为每个curd模板的文件名
			const folder = distFolderName + '/' + key;
			if(exists) {
				// 存在dist文件
				mkdirTemplate(folder, body, resolve);
			} else {
				// 不存在
				fs.mkdir(distFolderName, function(err) {
					if(err) {
						console.log(err);
					}
					mkdirTemplate(folder, body, resolve);
				})
			}
		})
	});
	
}

module.exports = cli;