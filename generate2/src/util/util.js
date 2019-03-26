const fs = require('fs');
const YAML = require('yamljs');
const moment = require('moment');

class Util {
	
	// 读取yaml文件
	// @param [{file}] 文件路径
	static loadYAMLFile(file) {
		return YAML.parse(fs.readFileSync(file).toString()); 
	}

	// 首字母大写
	static firstUpperCase(str) {
		return str.replace(/^\S/, function(s){return s.toUpperCase();});
	}
}

module.exports = Util;