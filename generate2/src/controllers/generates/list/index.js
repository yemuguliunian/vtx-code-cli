/**
 * 列表服务
 */
const BasicGenerator = require('../../BasicGenerator.js');

const getRouteParams = require('./renderData/route.js');
const getModalParams = require('./renderData/modal.js');

class Generator extends BasicGenerator {

    writing() {
        const { searchParams, parameters, listParams, isExport, isView } = this.body;

        const route = getRouteParams({searchParams, parameters, listParams, isExport});
        const modal = getModalParams({searchParams, parameters});

        this.writeFiles({
            context: {
                ...this.context,
                defaultValue: this.defaultValue,
                route,
                modal
            },
            filterFiles: f => {
                let files = [
                    'modal.js',
                    'route.js'
                ];
                if(isView) {
                    files = [...files, 'View.js'];
                }
                return files.indexOf(f) > -1;
            }
        });
    }


}

module.exports = Generator;
