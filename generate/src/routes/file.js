/**
 * 文件服务
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const zipper = require("zip-local");

const distFolderName = _config.distFolderName;

/* GET home page. */
router.get('/downLoadZip', function(req, res, next) {
  	const { id } = req.query;
    if(!id) {
        return;
    }
    const dayFolder = id.split('_')[1].substring(0, 8);
    const dayFolderPath = path.resolve(__dirname, `../../${distFolderName}/${dayFolder}`);
    let fPath = path.resolve(__dirname, `../../${distFolderName}/${dayFolder}/${id}`);
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
                                'Content-Disposition': `attachment; filename=${id}.zip`
                            });
                            bufferStream.pipe(res);
                        }
                    }); 
                }
            })
        }
    })
});

router.get('/downLoadConfig', function(req, res, next) {
    const { id } = req.query;
    if(!id) {
        return;
    }
    const dayFolder = id.split('_')[1].substring(0, 8);
    const dayFolderPath = path.resolve(__dirname, `../../${distFolderName}/${dayFolder}`);
    let fPath = path.resolve(__dirname, `../../${distFolderName}/${dayFolder}/${id}`);

    // 检测导出的模板路径是否存在
    fs.exists( dayFolderPath, function(exists) {
        if(exists) {
            fs.exists( fPath, function(exists) {
                // 存在则导出
                if(exists) {
                    fs.exists( `${fPath}/config.json`, function(exists) {
                        if(exists) {
                            res.download(`${fPath}/config.json`, `${id}_config.json`);
                        }
                    })
                }
            })
        }
    })
});

module.exports = router;
