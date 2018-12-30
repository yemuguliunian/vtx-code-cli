import HttpService from '../utils/request.js';

export async function cli(param) {
    return HttpService.post('/code/generator/cli/curd', {
        body: JSON.stringify(param)
    })
}
