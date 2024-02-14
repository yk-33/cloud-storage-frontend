import { BACK_END_URL } from "@/config/config"

export async function _fetch(url, method = 'GET', params = {}, data = {} ){
    url = BACK_END_URL + url
    let myRes
    
    if(Object.keys(params).length !== 0){
        url = `${url}?${joinParams(params)}`
    }
    try{
        let res
        if(Object.keys(data).length === 0){
            res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include'
            })
        }
        else{
            res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })
        }
    
        if(res.ok === false){
            let autoResponseBody = await res.json()
            myRes = {
                code: res.status,
                message: autoResponseBody.error,
                data: null,
            }
            return myRes
        }
        
        myRes = await res.json()
        return myRes
    }
    catch(err){
        console.log(`response错误: ${err}`)
        myRes = {
            code: 503,
            message: '网络问题',
            data: null,
        }
        return myRes
    }
};

function joinParams(obj) {
    let result = '';
    let item;
    for (item in obj) {
      if (String(obj[item])) {
        result += `&${item}=${obj[item]}`;
      }
    }
    if (result) {
      result = '&' + result.slice(1);
    }
    return result;
}