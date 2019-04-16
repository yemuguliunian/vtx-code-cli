const BasicGenerator = require('../../BasicGenerator.js');

const getRouteParams = require('./renderData/route.js');
const getAddAndViewParams = require('./renderData/addAndView.js');

class Generator extends BasicGenerator {

    writing() {
        const { searchParams, parameters, listParams } = this.body;

        const route = getRouteParams({searchParams, parameters, listParams});
        const { add, view } = getAddAndViewParams(parameters);

        this.writeFiles({
            context: {
                ...this.context,
                route,
                add,
                view
            },
            filterFiles: f => {
                return true;
            }
        });
    }
}

module.exports = Generator;
