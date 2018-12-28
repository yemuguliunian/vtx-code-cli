const fs = require('fs');  
const moment = require('moment');

const initView = require('./init/initView.js');
const initADD = require('./init/initADD.js');
const initCModal = require('./init/initCModal.js');

const _console = require('./util/console.js');

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
						_console.log('error', err);
					} else {
						_console.log('success', `new [Folder] ${folderName}`);
						Promise.all([
							new Promise((resolve, reject) => {
								// ADD.js
								fs.writeFile(folderName + '/ADD.js', initADD(parameters, namespace), function(err){
								    if(err) {
								    	_console.log('error', err);
								    } else {
								    	_console.log('success', `new [File] ${folderName}/ADD.js`);
								    	resolve(`new [File] ${folderName}/ADD.js`);
								    }
								});
							}),
							new Promise((resolve, reject) => {
								// View.js
								fs.writeFile(folderName + '/View.js', initView(parameters, namespace), function(err){
								    if(err) {
								    	_console.log('error', err);
								    } else {
								    	_console.log('success', `new [File] ${folderName}/View.js`);
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
		fs.writeFile(modalFolerPath, initCModal(body), function(err){
		    if(err) {
		    	_console.log('error', err);
		    } else {
		    	_console.log('success', `new [File] ${modalFolerPath}`);
		    	resolve(`new [File] ${modalFolerPath}`);
		    }
		});
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
						_console.log('error', err);
					} else {
						_console.log('divid', 'start init template');
						_console.log('success', `new [Folder] ${folder}`);
						Promise.all([
							writeAddFile(folder, body),
							writeCModal(folder, body)
						]).then((result) => {
							const id = folder.split('/')[2];
							resolveCli({id : id, status : '1000'});
							_console.log('divid', 'end init template', '\n');
						});
					}
				})
			}
		})
	});
}

// 以每天作为一个单元产生一个当天的总包
function generateDayFolder(distFolderName, body, resolve) {
	const current = moment().format('YYYYMMDD');
	const dayFolder = distFolderName + '/' + current;
	fs.exists( dayFolder, function(exists) {
		// 唯一标识 vtx__时间
	    const key = `vtx_${moment().format('YYYYMMDDHHmmss')}`;
	    // 以id作为每个curd模板的文件名
		const tFolder = dayFolder + '/' + key;
		if(exists) {
			// 存在
			// 初始化模板
			mkdirTemplate(tFolder, body, resolve);
		} else {
			// 不存在
			fs.mkdir(dayFolder, function(err) {
				if(err) {
					_console.log('error', err);
				}
				// 初始化模板
				mkdirTemplate(tFolder, body, resolve);
			})
		}
	})
} 

// cli初始
function cli(body) {
	// initFolder
	const distFolderName = _config.distFolderName;
	return new Promise((resolve, reject) => {
		const { namespace } = body;
		// namespace未定义
		if(!namespace) {
			resolve({status : '1001'});
			return;
		}
		// 是否存在dist文件
		fs.exists( distFolderName, function(exists) {
			if(exists) {
				// 存在dist文件
				generateDayFolder(distFolderName, body, resolve);
			} else {
				// 不存在
				fs.mkdir(distFolderName, function(err) {
					if(err) {
						_console.log('error', err);
					}
					generateDayFolder(distFolderName, body, resolve);
				})
			}
		})
	});
}

module.exports = cli;