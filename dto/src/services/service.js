import HttpService from '../utils/request.js';

export async function cli(param) {
    return HttpService.post('/curd/cli', {
        body: JSON.stringify(param)
    })
}
