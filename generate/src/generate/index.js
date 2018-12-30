const fs = require('fs');  
const moment = require('moment');

// 日志
const logger = require('../../middleware/logger.js');

const initCurd = require('./curd/index.js');

const distFolderName = _config.distFolderName;

class Generate {

	constructor(type, body) { 
		this.type = type;
		this.body = body;
		this.task = {
			curd({folder, body, resolve, reject}) {
				initCurd({folder, body, resolve, reject});
			}
		}
	}
	
	new() {
		const _t = this;
		return new Promise((resolve, reject) => {
			const { namespace } = _t.body;
			// namespace未定义
			if(!namespace) {
				resolve({status : '1001'});
				return;
			}
			// 是否存在dist文件
			fs.exists( distFolderName, function(exists) {
				if(exists) {
					// 存在dist文件
					_t.generateDayFolder(resolve, reject);
				} else {
					// 不存在
					fs.mkdir(distFolderName, function(err) {
						if(err) {
							logger.error(`创建${distFolderName}失败 ` + err);
						}
						logger.info(`success mkdir ${distFolderName}`);
						_t.generateDayFolder(resolve, reject);
					})
				}
			})
		});
	}
	
	// 以每天作为一个单元产生一个当天的总包
	generateDayFolder(resolve, reject) {
		const _t = this;
		const current = moment().format('YYYYMMDD');
		const dayFolder = distFolderName + '/' + current;
		fs.exists( dayFolder, function(exists) {
			// 唯一标识 vtx__时间
		    const key = `vtx_${moment().format('YYYYMMDDHHmmss')}`;
		    // 以id作为每个模板的文件名
			const tFolder = dayFolder + '/' + key;
			if(exists) {
				// 存在
				// 初始化模板
				_t.mkdirTemplate(tFolder, resolve, reject);
			} else {
				// 不存在
				fs.mkdir(dayFolder, function(err) {
					if(err) {
						logger.error(`创建${dayFolder}失败 ` + err);
					}
					logger.info(`success mkdir ${dayFolder}`);
					// 初始化模板
					_t.mkdirTemplate(tFolder, resolve, reject);
				})
			}
		})
	}
	
	// 新建模板，每个模板缓存一份，定期清理
	mkdirTemplate(folder, resolveG, rejectG) {
		const _t = this;
		return new Promise((resolve, reject) => {
			// 是否存在${folder}文件
			fs.exists( folder, function(exists) {
				// 已存在
				if(exists) {
					let strArr = folder.split('_');
					strArr[2] = String(parseInt(strArr[2] || '0') + 1);
					folder = strArr.join('_');
					// 若存在重新创建
					_t.mkdirTemplate(folder, resolveG, rejectG);
				} else {
					fs.mkdir(folder, function(err) {
						if(err) {
							logger.error(`创建${folder}失败 ` + err);
						} else {
							logger.info(`success mkdir ${folder}`);
							_t.dispacth(folder, resolveG, rejectG);
						}
					})
				}
			})
		});
	}
	
	// 派发任务
	dispacth(folder, resolveG, rejectG) {
		const _t = this;
		this.task[_t.type]({
			folder, 
			body : _t.body,
			resolve : resolveG,
			reject : rejectG
		});
	}
}

module.exports = function generate({type, body}) {
	const gen = new Generate(type, body);
	return gen.new();
};
