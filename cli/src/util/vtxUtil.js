const moment = require('moment');

function getTime() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
}

// 一维数组转二维数组
function split_array(arr, len) {
	var a_len = arr.length;
	var result = [];
	for(var i = 0; i<a_len; i+=len) {
		result.push(arr.slice(i, i+len));
	}
	return result;
}

// 缩进字符
function indent(num) {
	return num ? new Array( num + 1 ).join(" ") : "";
}

// 数组去重
function dedupe(array) {
    return Array.from(new Set(array));
}

// 首字母大写
function firstUpperCase(str) {
	return str.replace(/^\S/, function(s){return s.toUpperCase();});
}

module.exports = {
	split_array : split_array,
	indent : indent,
	getTime : getTime
};