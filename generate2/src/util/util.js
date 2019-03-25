const fs = require('fs');
const YAML = require('yamljs');
const moment = require('moment');

class Util {
	
	// 读取yaml文件
	// @param [{file}] 文件路径
	static loadYAMLFile(file) {
		return YAML.parse(fs.readFileSync(file).toString()); 
	}
}

module.exports = Util;