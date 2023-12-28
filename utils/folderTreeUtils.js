
const getFolderPath = (folderStructor, folderId)=>{
    let folderPath = [];
    recursiveBuildPath(folderStructor, folderId, folderPath)
    folderPath.reverse()
    return folderPath
}

const recursiveBuildPath = (folder, targetFoderId, pathArr)=>{
    if(folder.id === targetFoderId){
        pathArr.push(folder)  //{id: folder.id, name: folder.name}
        return true
    }
    let children = folder.children
    
    let child
    for(child of children){
        let res = recursiveBuildPath(child, targetFoderId, pathArr)
        if(res === true){
            pathArr.push(folder)
            return true
        }
    }
    return false
}

const getFolders = (folder, targetFolderId)=>{
    if(folder.id === targetFolderId){
        return {finded: true, folderList: folder.children}
    }
    let children = folder.children
    for(let child of children){
        let {finded, folderList} = getFolders(child, targetFolderId)
        if(finded){
            return {finded: true, folderList: folderList}
        }
    }
    return {finded: false, folderList: []}
}

const checkFolderExist = (folder, targetFolderId)=>{
    if(targetFolderId === null){
        return false
    }
    if(folder.id === targetFolderId){
        return true
    }
    let children = folder.children
    for(let child of children){
        let isExist = checkFolderExist(child, targetFolderId)
        if(isExist){
            return true
        }
    }
    return false
}

const newFolderExpand = (folderStructor, folderExpand)=>{
    let folderExpandSet = new Set(folderExpand)
    let folderSet = new Set()
    recursiveAddFolderIdToSet(folderStructor, folderSet)
    let folderIdIntersection = new Set([...folderExpandSet].filter(x=>folderSet.has(x)))
    return [...folderIdIntersection]
}

const recursiveAddFolderIdToSet = (folder, set)=>{
    set.add(folder.id.toString())
    let children = folder.children
    for(let child of children){
        recursiveAddFolderIdToSet(child, set)
    }
}
export {getFolderPath, recursiveBuildPath, getFolders, checkFolderExist, newFolderExpand}