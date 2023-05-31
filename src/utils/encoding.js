export function payloadAssemble(value,mode){
    let obj ={};
    obj['con'] = `{\"id\":\"\",\"mode\":\"${mode}\",\"appuserid\":\"\"}`
    obj['f'] = `m-test2.orail.co.in (${mode})`;
    obj['p'] = value
    return JSON.stringify(obj)
}

export function auth(v,auth){
    let obj = {};
    obj['Authorization'] = auth;
    obj['version'] = v;
    obj['YearCode'] = process.env.REACT_APP_YEAR_CODE;
    obj["Content-Type"] = "application/json"

    return obj
}

export function encode(payload){
    return window.btoa(JSON.stringify(payload))
}
export function decode(payload){
    return JSON.parse(window.atob(payload))
}