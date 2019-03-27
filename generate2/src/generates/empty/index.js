const BasicGenerator = require('../BasicGenerator.js');

class Generator extends BasicGenerator {

    writing() {
        this.writeFiles({
            context: {
                ...this.body
            },
            filterFiles: f => {
                return true;
            }
        });
    }
}

module.exports = Generator;
