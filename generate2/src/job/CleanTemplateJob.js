/**
 * 定时器：定时清理dist目录下的文件
 * 每天凌晨检查是否有缓存{7}天的文件
 * 有则清理掉
 */
const fs = require('fs');  
const path = require('path');
const moment = require('moment');  
const rimraf = require('rimraf');
const chalk = require('chalk');

const _clean = Symbol('clean');

class CleanTemplateJob {

	constructor() { 
		// 间隔天数
		this.interval = 1, 
		// 保存天数 
		this.storageTime = 7 
	}
	
	// 启动
	start() {
		const _t = this;
		let current = new Date();
		let next = new Date();
		next.setDate(current.getDate() + _t.interval);
		next.setHours(0);
		next.setMinutes(0);
		next.setSeconds(0);
		
		setTimeout(() => _t[_clean](), next - current);
	}
	
	[_clean]() {
		const _t = this;
		const distFolderName = _config.distFolderName;
		// do something
		fs.exists( distFolderName, function(exists) {
			if(exists) {
				fs.readdir(distFolderName, function(err, files) {
					if(err) {
						console.error(err);
					} else {
						files.forEach(function(filename) {
							let fileDay = moment(filename, 'YYYYMMDD').format('YYYY-MM-DD');
							const current = moment().format('YYYY-MM-DD');
							const diff = moment(current).diff(moment(fileDay), 'days');
							// 清理超出{storageTime}的文件
							if(diff > _t.storageTime) {
								let cleanFolderPath = 
										path.resolve(__dirname, `../../${distFolderName}/${filename}`);
								// 验证此文件是否还存在
								fs.exists(cleanFolderPath, function(exists) {
									if(exists) {
										// 暴力删除文件
										rimraf(cleanFolderPath, function(err) {
											if(err) {
												console.error(err);
											} else {
												console.log(chalk.red('   delete ') + cleanFolderPath);
											}
										})
									}
								})
							}

						}) 
					}
				})
			}
		})
		setTimeout(() => _t[_clean](), _t.interval * 24 * 60 * 60 * 1000);
	}
}

const cleanTemplateJob = new CleanTemplateJob();
cleanTemplateJob.start();
