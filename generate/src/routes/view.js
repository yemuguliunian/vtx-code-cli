var express = require('express');
var router = express.Router();
var fs = require('fs');  
var path = require('path');  
var copy = require('copy-to-clipboard');

const distFolderName = _config.distFolderName;

/* GET home page. */
router.get('/', function(req, res, next) {
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
                    let list = [];
					readFile(fPath, list);
					res.render('preview', { 
						list: list,
						copyEvent(content) {
							copy(item);
						}
					});
                }
            })
        }
    })
});

function readFile(distFolderName, list = []) {
	var readDir = fs.readdirSync(distFolderName);
	readDir.map(filename => {
		var filePath = path.join(distFolderName, filename);  
		var stats = fs.statSync(filePath);
		if(stats.isFile()) {
			let file = fs.readFileSync(filePath, 'utf-8');
			list.push({
				name : filename,
				content : file
			});
		}
		if(stats.isDirectory()) {
			readFile(filePath, list)
		}
	})
}

module.exports = router;
