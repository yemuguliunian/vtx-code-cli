/**
 * 记录保存
 */
const fs = require('fs');  
const path = require('path');  

class Logger {

	constructor() { 
		this.logFolder = 'log';
		this.successFolder = 'success';
		this.errorFolder = 'error';
	}

	init() {
		return new Promise((resolve, reject) => {
			const _t = this;
			let folder = path.resolve(__dirname, `../../${_t.logFolder}`);
			fs.exists( folder, function(exists) {
				if(!exists) {
					fs.mkdir(folder, function(err) {
						if(!err) {
							resolve();
						}
					})
				} else {
					resolve();
				}
			})
		});
		
	}

	success(msg) {
		const _t = this;
		let folder = path.resolve(__dirname, `../../${_t.logFolder}/${_t.successFolder}.txt`);
		this.init().then(() => {
			fs.appendFile( folder, msg, function(err) {
				if(err) {
					console.log(err);
				}
			})
		})
		
	}

	error(msg) {
		const _t = this;
		let folder = path.resolve(__dirname, `../../${_t.logFolder}/${_t.errorFolder}.txt`);
		this.init().then(() => {
			fs.appendFile( folder, msg, function(err) {
				if(err) {
					console.log(err);
				}
			})
		})
	}
}

const logger = new Logger();
logger.init();

module.exports = logger;