/**
 * 控制台打印统一处理
 */
require('console-color-mr');
const { getTime } = require('./vtxUtil.js');

const _event = Symbol('event');

class Console {

	constructor() { 

	}

	log(type, msg, char = '') {
		const _t = this;
		// do something
		return this[_event]()[type](msg, char);
	}

	[_event]() {
		let time = getTime();
		return {
			log(msg) {
				console.log(time, msg);
			},
			success(msg) {
				console.log(time, 'SUCCESS'.green, msg);
			},
			error(msg) {
				console.log(time, 'ERROR'.red, msg);
			},
			warn(msg) {
				console.warn(time.red, 'WARN'.red, msg.red);
			},
			divid(msg, char) {
				console.log(`--------------${msg}--------------`, char);
			},
			delete(msg) {
				console.warn(time.red, 'DELETE'.red, msg.red);
			}
		}
	}
}

const _console = new Console();
module.exports = _console;