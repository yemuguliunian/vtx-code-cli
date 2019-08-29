const express = require('express');
const router = express.Router();
const generate = require('../controllers/index.js');

const Util = require('../util/util');
const moment = require('moment');
const chalk = require('chalk');

const response = (status, id) => {
	let json = {
        exception: id ? "" : `【${status}】${appliaction.status_code[status]}`,
        msg: id ? appliaction.status_code[status] : "",
        result: id ? 0 : 1
    };
    if(id) {
        json['id'] = id;
    }
    return json;
}

function message(type) {
    type = Util.firstUpperCase(type);
    console.log('');
    console.log(`File(${chalk.green(type)}) Generate Begin` + chalk.gray(` ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
}

// CURD 服务
router.post('/curd', function(req, res, next) {
    message('curd');
    generate({
        type : 'curd',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    }).catch((err) => {
        console.error(err);
    });
});

// 列表 服务
router.post('/list', function(req, res, next) {
    message('list');
	generate({
        type : 'list',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    }).catch((err) => {
        console.error(err);
    });
});

// 报表服务
router.post('/report', function(req, res, next) {
    message('report');
	generate({
        type : 'report',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    }).catch((err) => {
        console.error(err);
    });
});

// 空模板
router.post('/empty', function(req, res, next) {
    message('empty');
    generate({
        type : 'empty',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = router;
