/**
 * 中间件-日志打印
 */
var morgan = require('morgan');
var rfs = require('rotating-file-stream');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
require('console-color-mr');

var logDirectory = path.join(__dirname, '../log')

class Logger {

	constructor() { 
		this.successLogStream = '';
		this.errorLogStream = '';
	}

	init(app) {
		const _t = this;
		// loger
		fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

		_t.successLogStream = rfs('success.log', {
		  	interval: '1d', // rotate daily
		  	path: logDirectory
		})
		_t.errorLogStream = rfs('error.log', {
		  	interval: '1d', // rotate daily
		  	path: logDirectory
		})

		// 自定义token
		morgan.token('time', function(req, res){
		    return moment().format("YYYY-MM-DD HH:mm:ss"); 
		});
		morgan.token('nextROw', function(req, res){
		    return "\r\n"; 
		});
		// 自定义format，其中包含自定义的token
		morgan.format('logger', '[RUNING] :time :remote-addr :remote-user :method :url HTTP/:http-version" :status :referrer :response-time ms :user-agent :nextROw');

		app.use(morgan('logger'));
		app.use(morgan('logger', { stream: _t.successLogStream }));
	}

	format(msg) {
		return `[SYSTEM] ${moment().format("YYYY-MM-DD HH:mm:ss")} ${msg} \r\n`
	}

	info(msg) {
		const _t = this;
		if(this.successLogStream) {
			console.log(_t.format(msg).green);
			this.successLogStream.write(_t.format(msg));
		} else {
			console.log('logger in not init'.red);
		}
	}

	error(msg) {
		const _t = this;
		if(this.errorLogStream) {
			console.log(_t.format(msg).red);
			this.errorLogStream.write(_t.format(msg));
		} else {
			console.log('logger in not init'.red);
		}
	}
}

var logger = new Logger();
module.exports = logger;


