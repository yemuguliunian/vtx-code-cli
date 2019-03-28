const BasicGenerator = require('../../BasicGenerator.js');

class Generator extends BasicGenerator {

    writing() {
        this.writeFiles({
            context: {
                ...this.context
            },
            filterFiles: f => {
                return true;
            }
        });
    }
}

module.exports = Generator;
