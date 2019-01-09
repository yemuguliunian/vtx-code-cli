/**
 * 代码生成服务
 */
var express = require('express');
var router = express.Router();
var generate = require('../generate/index.js');

router.post('/curd', function(req, res, next) {
    generate({
        type : 'curd',
        body : req.body
    }).then(({status, id}) => {
        let msg = {
            exception: id ? "" : `【${status}】${_config.status_code[status]}`,
            msg: id ? _config.status_code[status] : "",
            result: id ? 0 : 1
        };
        if(id) {
            msg['id'] = id;
        }
        res.json(msg)
    });
});

router.post('/list', function(req, res, next) {
	generate({
        type : 'list',
        body : req.body
    }).then(({status, id}) => {
        let msg = {
            exception: id ? "" : `【${status}】${_config.status_code[status]}`,
            msg: id ? _config.status_code[status] : "",
            result: id ? 0 : 1
        };
        if(id) {
            msg['id'] = id;
        }
        res.json(msg)
    });
});

router.post('/report', function(req, res, next) {
	
});

router.post('/empty', function(req, res, next) {
    generate({
        type : 'empty',
        body : req.body
    }).then(({status, id}) => {
        let msg = {
            exception: id ? "" : `【${status}】${_config.status_code[status]}`,
            msg: id ? _config.status_code[status] : "",
            result: id ? 0 : 1
        };
        if(id) {
            msg['id'] = id;
        }
        res.json(msg)
    });
});

module.exports = router;
