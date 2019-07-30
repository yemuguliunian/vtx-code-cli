const BasicGenerator = require('../../BasicGenerator.js');

const getRouteParams = require('./renderData/route.js');
const getModalParams = require('./renderData/modal.js');
const getAddAndViewParams = require('./renderData/addAndView.js');

class Generator extends BasicGenerator {

    writing() {
        const { searchParams, parameters, listParams, isExport, isImport } = this.body;

        const route = getRouteParams({searchParams, parameters, listParams, isExport, isImport});
        const modal = getModalParams({searchParams, parameters});
        const { add, view } = getAddAndViewParams(parameters);

        this.writeFiles({
            context: {
                ...this.context,
                defaultValue : this.defaultValue,
                route,
                modal,
                add,
                view
            },
            filterFiles: f => {
                // // 调试用 默认都返回true
                // let files = [
                //     'Add.js',
                //     'modal.js',
                //     'route.js',
                //     'View.js'
                // ];
                // return files.indexOf(f) > -1;
                return true;
            }
        });
    }


}

module.exports = Generator;
