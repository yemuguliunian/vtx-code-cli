const fs = require('fs');  
const path = require('path');  
const stream = require('stream');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const YAML = require('yamljs');
const zipper = require("zip-local");
const get_ip = require('ipware')().get_ip;

const cli = require('./src/cli.js');

// 加载配置文件并设置全局变量
function loadYAMLFile (file) { 
    return YAML.parse(fs.readFileSync(file).toString()); 
}
global._config = loadYAMLFile(path.resolve(__dirname, './config.yaml'));

// 定时器
const CleanTemplateJob = require('./src/job/CleanTemplateJob.js');
const ctj = new CleanTemplateJob();
ctj.init;

// 设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 初始化curd模板
app.post('/curd/cli', function(req, res){
    var ip_info = get_ip(req);
    cli(req.body).then(({status, id}) => {
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
    
}) 

// 导出模板
app.get('/curd/downLoadZip', function(req, res) {
    const { id } = req.query;
    if(!id) {
        return;
    }
    const dayFolder = id.split('_')[1].substring(0, 8);
    const dayFolderPath = path.resolve(__dirname, `./${_config.distFolderName}/${dayFolder}`);
    let fPath = path.resolve(__dirname, `./${_config.distFolderName}/${dayFolder}/${id}`);
    // 检测导出的模板路径是否存在
    fs.exists( dayFolderPath, function(exists) {
        if(exists) {
            fs.exists( fPath, function(exists) {
                // 存在则导出
                if(exists) {
                    zipper.zip(fPath, function(error, zipped) {
                        if(!error) {
                            zipped.compress(); // compress before exporting
                            const buff = zipped.memory(); // get the zipped file as a Buffer
                            const bufferStream = new stream.PassThrough;
                            bufferStream.end(buff);
                            res.writeHead(200, {
                                'Content-Type': 'application/force-download',
                                'Content-Disposition': 'attachment; filename=dist.zip'
                            });
                            bufferStream.pipe(res);
                        }
                    }); 
                }
            })
        }
    })
})

// 监听8088端口
const server = app.listen(_config.port, '0.0.0.0', function () {
 
    const host = server.address().address;
    const port = server.address().port;
 
    console.log('The app is runing at:')
 	console.log('\033[0;32m Http://localhost:'+port+'\033[0m\n')
})