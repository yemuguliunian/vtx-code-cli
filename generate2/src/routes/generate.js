const express = require('express');
const router = express.Router();
const generate = require('../controllers/index.js');

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

// CURD 服务
router.post('/curd', function(req, res, next) {
    generate({
        type : 'curd',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    });
});

// 列表 服务
router.post('/list', function(req, res, next) {
	generate({
        type : 'list',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    });
});

// 报表服务
router.post('/report', function(req, res, next) {
	generate({
        type : 'report',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    });
});

// 空模板
router.post('/empty', function(req, res, next) {
    generate({
        type : 'empty',
        body : req.body
    }).then(({status, id}) => {
        res.json(response(status, id));
    });
});

module.exports = router;
