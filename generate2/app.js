var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Util = require('./src/util/util.js');

// 加载配置文件并设置全局变量 {appliaction}
global.appliaction = Util.loadYAMLFile(path.resolve(__dirname, './appliaction.yaml'));

var indexRouter = require('./src/routes/index');
var generateRouter = require('./src/routes/generate');
var viewRouter = require('./src/routes/view');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(`${appliaction.gateway}/cli`, generateRouter);
app.use(`${appliaction.gateway}/view`, viewRouter);

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
