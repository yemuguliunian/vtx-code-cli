const express = require('express');
const router = express.Router();
const fs = require('fs');  
const path = require('path'); 
const clipboardy = require('clipboardy');

const distFolderName = appliaction.distFolderName;

/* GET home page. */
router.get('/', function(req, res, next) {
	const { id } = req.query;
    if(!id) {
        return;
    }
    let dayFolder = id.split('_')[1].substring(0, 8);
    dayFolder = path.resolve(__dirname, `../../${distFolderName}/${dayFolder}`);
    let fPath = path.join(dayFolder, id);
    // 检测导出的模板路径是否存在
    let existDayFolder = fs.existsSync(dayFolder);
    if(existDayFolder) {
    	fs.exists( fPath, function(exists) {
            // 存在则导出
            if(exists) {
                let list = [];
				readFile(fPath, list);
				res.render('view', { 
					list: list,
					title : id
				});
            }
        })
    }
});

function readFile(templatePath, list = []) {
	var readDir = fs.readdirSync(templatePath);
	readDir.map(filename => {
		var filePath = path.join(templatePath, filename);  
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
