/**
 * 定时器：定时清理logger日志
 * 每天凌晨检查是否有超过7天的日志
 * 有则清理掉
 */
const fs = require('fs');  
const path = require('path');
const moment = require('moment');  
const rimraf = require('rimraf');

const logger = require('../../middleware/logger.js');

const _clean = Symbol('clean');

class CleanLoggerJob {

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
		const distFolderName = 'log';
		// do something
		fs.exists( distFolderName, function(exists) {
			if(exists) {
				fs.readdir(distFolderName, function(err, files) {
					if(err) {
						logger.error(err);
					} else {
						files.forEach(function(filename) {
							if(filename.indexOf('-') > -1) {
								let fileDay = moment(filename.split('-')[0], 'YYYYMMDD').format('YYYY-MM-DD');
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
													logger.error(err);
												} else {
													logger.info(`${cleanFolderPath}文件已超过7天，已删除`);
												}
											})
										}
									})
								}
							}
						}) 
					}
				})
			}
		})
		setTimeout(() => _t[_clean](), _t.interval * 24 * 60 * 60 * 1000);
	}
}

const cleanLoggerJob = new CleanLoggerJob();
cleanLoggerJob.start();
