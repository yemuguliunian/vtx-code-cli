const Generator = require('yeoman-generator');
const glob = require('glob');
const { statSync } = require('fs');
const { basename } = require('path');
const debug = require('debug')('vtx-code-cli:BasicGenerator');

const moment = require('moment');
const _ = require('lodash');
const Util = require('../util/util.js');

function noop() {
  	return true;
}

class BasicGenerator extends Generator {

	constructor(opts) {
    	super(opts);
    	this.opts = opts;
    	this.body = Util.handleTrim(opts.body);
        this.defaultValue = {
            text : '',
            textarea : '',
            select : undefined,
            treeSelect : [],
            day : '',
            month : '',
            year : '',
            range : '',
            upload : []
        },
        this.context = {
            ...this.body,
            upperFirst : _.upperFirst,
            chunk : _.chunk,
            getTime : function() {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }
        }
  	}
	
  	writeFiles({ context, filterFiles = noop }) {
  		glob.sync('**/*', {
	        cwd: this.templatePath(),
	        dot: true
      	}).filter(filterFiles).forEach(file => {
      		debug(`create ${file}`);
			const filePath = this.templatePath(file);
			if (statSync(filePath).isFile()) {
	          	this.fs.copyTpl(
		            this.templatePath(filePath),
		            this.destinationPath(file.replace(/^_/, '.')),
		            context
	          	);
	        }
      	})
  	}
}

module.exports = BasicGenerator;