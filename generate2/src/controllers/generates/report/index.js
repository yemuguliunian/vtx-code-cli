const BasicGenerator = require('../../BasicGenerator.js');

const getRouteParams = require('./renderData/route.js');
const getModalParams = require('./renderData/modal.js');

class Generator extends BasicGenerator {

    writing() {

        const { searchParams } = this.body;
        
        const route = getRouteParams({searchParams});
        const modal = getModalParams({searchParams});

        this.writeFiles({
            context: {
                ...this.context,
                defaultValue : this.defaultValue,
                route,
                modal
            },
            filterFiles: f => {
                return true;
            }
        });
    }
}

module.exports = Generator;
