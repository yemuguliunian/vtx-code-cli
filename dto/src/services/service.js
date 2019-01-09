import HttpService from '../utils/request.js';

export async function cliCurd(param) {
    return HttpService.post('/code/generator/cli/curd', {
        body: JSON.stringify(param)
    })
}

export async function cliEmpty(param) {
    return HttpService.post('/code/generator/cli/empty', {
        body: JSON.stringify(param)
    })
}

export async function cliList(param) {
    return HttpService.post('/code/generator/cli/list', {
        body: JSON.stringify(param)
    })
}