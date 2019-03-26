const Generator = require('yeoman-generator');
const glob = require('glob');
const { statSync } = require('fs');
const { basename } = require('path');
const debug = require('debug')('vtx-code-cli:BasicGenerator');

function noop() {
  	return true;
}

class BasicGenerator extends Generator {

	constructor(opts) {
    	super(opts);
    	this.opts = opts;
    	this.body = opts.body;
  	}
	
  	writeFiles({ context, filterFiles = noop }) {
  		glob.sync('**/*', {
	        cwd: this.templatePath(),
	        dot: true
      	})
      	.filter(filterFiles)
      	.forEach(file => {
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