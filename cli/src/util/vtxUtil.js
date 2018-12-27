const moment = require('moment');

function getTime() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
}

// node控制台提示
const messge = {
	log(msg, str = '') {
		console.log(`--------------${msg}--------------${str}`);
	},
	success(msg) {
		console.log(getTime() + ' \033[42;37msuccess\033[0;0m '+ msg +'\033[0m');
	}
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

module.exports = {
	split_array : split_array,
	indent : indent,
	messge : messge
};