/**
 * 列表服务
 */
const BasicGenerator = require('../../BasicGenerator.js');

const getRouteParams = require('./renderData/route.js');
const getModalParams = require('./renderData/modal.js');

class Generator extends BasicGenerator {

    writing() {
        const { searchParams, parameters, listParams } = this.body;

        const route = getRouteParams({searchParams, parameters, listParams});
        const modal = getModalParams({searchParams, parameters});

        this.writeFiles({
            context: {
                ...this.context,
                defaultValue: this.defaultValue,
                route,
                modal
            },
            filterFiles: f => {
                // // 调试用 默认都返回true
                // let files = [
                //     'modal.js',
                //     'route.js'
                // ];
                // return files.indexOf(f) > -1;
                return true;
            }
        });
    }


}

module.exports = Generator;
