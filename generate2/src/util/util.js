const fs = require('fs');
const YAML = require('yamljs');
const moment = require('moment');
const _ = require('lodash');

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

	/**
	 * 处理对象中字符串的前后空字符
	 * @param  {[obj]} obj [处理对象]
	 * @return {[obj]}     [处理后的对象]
	 */
	static handleTrim(obj) {
	    let objClone = _.cloneDeep(obj);
	    if(!_.isObject(objClone)) {
	        throw new Error('参数类型错误，参数必须是对象');
	        return;
	    }
	    _.mapKeys(obj, function(value, key) {
	        if(!!value && _.isString(value)) {
	            objClone[key] = value.trim();
	        }
	    })
	    return objClone;
	}
}

module.exports = Util;