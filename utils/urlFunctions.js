export const newLanguageUrl = (pathname, lang)=>{  //原始路径加入语言类型
    let newPathname = '/' + lang + pathname
    return newPathname
}

export const urlWithoutLanguage = (pathname)=>{ //删除最前面的语言类型
    return pathname.replace(/^\/[^\/]+/, '') 
}

export const newDesUrl = (pathname, des)=>{ //替换最前面的语言类型
    let newPathname = pathname.match(/^\/[^\/]+/)[0] + des
    return newPathname
}