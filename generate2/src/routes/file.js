/**
 * 文件服务
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const zipper = require("zip-local");
const debug = require('debug')('vtx-code-cli:file');
const chalk = require('chalk');

const distFolderName = appliaction.distFolderName;

// 检测模板是否存在
const checkExist = (id) => {
	return new Promise((resolve, reject) => {
	    if(!id) {
	    	reject(id);
	        return;
	    }
	    let dayFolder = id.split('_')[1].substring(0, 8);
	    dayFolder = path.resolve(__dirname, `../../${distFolderName}/${dayFolder}`);
	    let fPath = path.join(dayFolder, id);
	    // 检测导出的模板路径是否存在
    	let existDayFolder = fs.existsSync(dayFolder);
    	if(existDayFolder) {
	    	fs.exists( fPath, function(exists) {
	            // 存在
	            if(exists) {
	                resolve(fPath);
	            }
	        })
	    }
	});
}

// 模板下载
router.get('/downLoadZip', function(req, res, next) {
  	const { id } = req.query;
  	checkExist(id).then((path) => {
  		if(path) {
  			zipper.zip(path, function(error, zipped) {
                if(!error) {
                	debug(`download ${id}`);
                    zipped.compress(); // compress before exporting
                    const buff = zipped.memory(); // get the zipped file as a Buffer
                    const bufferStream = new stream.PassThrough;
                    bufferStream.end(buff);
                    res.writeHead(200, {
                        'Content-Type': 'application/force-download',
                        'Content-Disposition': `attachment; filename=${id}.zip`
                    });
                    bufferStream.pipe(res);
                }
            }); 
  		}
  	})
});

// 下载配置项
router.get('/downLoadConfig', function(req, res, next) {
    const { id } = req.query;
    checkExist(id).then((path) => {
    	if(path) {
    		fs.exists( `${path}/config.json`, function(exists) {
	            if(exists) {
	                res.download(`${path}/config.json`, `${id}_config.json`);
	                debug(`download ${id}_config.json`);
	                console.log(chalk.green('   download ') + `${id}_config.json`);
	            }
	        })
    	}
    })
});

module.exports = router;