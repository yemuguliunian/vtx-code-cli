var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var YAML = require('yamljs');
var logger = require('./middleware/logger.js');

// 加载配置文件并设置全局变量
function loadYAMLFile (file) { 
    return YAML.parse(fs.readFileSync(file).toString()); 
}
global._config = loadYAMLFile(path.resolve(__dirname, './config.yaml'));

// 定时器-定时dist目录下缓存超过7天的文件
require('./src/job/CleanTemplateJob.js');

// 路由
var indexRouter = require('./src/routes/index');
var cliRouter = require('./src/routes/cli');
var fileRouter = require('./src/routes/file');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'pug');

// logger 日志打印
logger.init(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(`${_config.gateway}/`, indexRouter);
app.use(`${_config.gateway}/cli`, cliRouter);
app.use(`${_config.gateway}/file`, fileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
  	res.locals.message = err.message;
  	res.locals.error = req.app.get('env') === 'development' ? err : {};

  	// render the error page
  	res.status(err.status || 500);
  	res.render('error');
});

module.exports = app;
