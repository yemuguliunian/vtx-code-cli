const BasicGenerator = require('../../BasicGenerator.js');

class Generator extends BasicGenerator {

    writing() {

        console.log(this.body);
        const { searchParams } = this.body;

        for(var i = searchParams.length - 1; i >= 0; i--) {
            
        }

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
