const BasicGenerator = require('../BasicGenerator.js');

const moment = require('moment');
const Util = require('../../util/util');

class Generator extends BasicGenerator {

    writing() {
        this.writeFiles({
            context: {
                ...this.body,
                firstUpperCase : Util.firstUpperCase,
                moment
            },
            filterFiles: f => {
                return true;
            }
        });
    }
}

module.exports = Generator;
