const fs = require('fs');  
const moment = require('moment');
const chalk = require('chalk');
const mkdirp  = require('mkdirp');
const debug = require('debug')('vtx-code-cli:generates');

const generateCurd = require('./curd/index.js');
const generateList = require('./list/index.js');
const generateReport = require('./report/index.js');
const generateEmpty = require('./empty/index.js');

const distFolderName = appliaction.distFolderName;

class Generate {

	constructor(type, body) { 
		this.type = type;
		this.body = body;
		// 任务（在此处注册新的任务）
		this.tasks = {
			curd : generateCurd,
			list : generateList,
			report : generateReport,
			empty : generateEmpty
		}
	}
	
	init() {
		const _t = this;
		return new Promise((resolve, reject) => {
			const { namespace } = _t.body;
			// namespace未定义
			if(!namespace) {
				resolve({status : '1001'});
				return;
			}
			// 创建dist目录
			mkdirp.sync(distFolderName);
			_t.mkdirDayFolder(resolve, reject);
		});
	}
	
	// 以每天作为一个单元产生一个当天的总包
	mkdirDayFolder(resolve, reject) {
		// 每天作为总包
		let currentDay = moment().format('YYYYMMDD'),
			currentTime = moment().format('YYYYMMDDHHmmss');
		const dayFolder = distFolderName + '/' + currentDay;
		// 唯一标识 vtx__时间
		const subFolder = dayFolder + '/' + `vtx_${currentTime}`;
		
		mkdirp.sync(dayFolder);
		this.mkdirTemplate(subFolder, resolve, reject);
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
					mkdirp.sync(folder);
					console.log(chalk.green('create ') + folder);
				}
			})
		});
	}
	
}

module.exports = function generate({type, body}) {
	const gen = new Generate(type, body);
	return gen.init();
};
