const fs = require('fs');  
const path = require('path');
const moment = require('moment');
const chalk = require('chalk');
const mkdirp  = require('mkdirp');
const debug = require('debug')('vtx-code-cli:generates');

const distFolderName = appliaction.distFolderName;

class Generate {

	constructor(type, body) { 
		this.type = type;
		this.body = body;
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
		const key = `vtx_${currentTime}`;
		const subFolder = path.join(dayFolder, key);
		
		mkdirp.sync(dayFolder);
		this.mkdirTemplate(subFolder, resolve, reject, key);
	}
	
	// 新建模板，每个模板缓存一份，定期清理
	mkdirTemplate(folder, resolveG, rejectG, id) {
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
					_t.mkdirTemplate(folder, resolveG, rejectG, id);
				} else {
					mkdirp.sync(folder);
					console.log(chalk.green('   create ') + folder);
					// 缓存一份配置项
					let options = path.join(folder, 'config.json');
					fs.writeFileSync(options, JSON.stringify(_t.body));
					debug(`writeFile ${options}`);
					console.log(chalk.green('   create ') + options);
					_t.runGenerator(folder, resolveG, rejectG, id).catch(e => {
					    console.error(chalk.red(`> Generate failed`), e);
					    process.exit(1);
				  	});
				}
			})
		});
	}

	runGenerator (folder, resolveG, rejectG, id){
		const _t = this;
		return new Promise(resolve => {
			let generatorPath = `./generates/${_t.type}`;
			const Generator = require(generatorPath);
			const generator = new Generator({
				body : _t.body,
		      	env: {
		        	cwd : path.join(process.cwd(), folder)
		      	},
	      		resolved: require.resolve(generatorPath),
	    	});
	    	return generator.run(() => {
	      		console.log('✨ File Generate Done');
	      		resolveG({
	      			id, status : 1000
	      		});
	      		resolve(true);
	    	});
		})
	}

	
}

module.exports = function generate({type, body}) {
	const gen = new Generate(type, body);
	return gen.init();
};
