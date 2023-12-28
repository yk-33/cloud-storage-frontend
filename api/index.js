import { _fetch } from "../utils/request"

import { BACK_END_URL } from "@/config/config"

//export  let reqRegist = (name, password)=>_fetch('/regist', {name, password}, 'POST')
// export  function reqRegist(name, password ){
//     return _fetch('/regist', {name, password}, 'POST')
// };
export default {
    reqRegisterUser: (username, password)=>_fetch('/users', 'POST', {}, {username, password}),
    reqLogin: (username, password)=>_fetch('/login', 'GET', {username, password}),
    reqJwtLogin: ()=>_fetch('/jwt-login'),
    reqLogout: ()=>_fetch('/logout'),
    reqCheckUsernameUnique: (username)=>_fetch(`/users/${username}`),

    reqGetFolderStructure: ()=>_fetch('/folder-structure'),
    reqNewFolder: (folderName, fatherFolderId)=>_fetch('/folders', 'POST', {}, {folderName, fatherFolderId}),
    reqPermanentDeleteFolder: (folderId)=>_fetch(`/folders/${folderId}`, 'DELETE'),
    reqMoveFolder: (folderId, newFatherFolderId)=>_fetch('/move-folder', 'PATCH', {}, {folderId, newFatherFolderId}),
    reqDeleteFolder: (folderId)=>_fetch(`/delete-folder/${folderId}`, 'DELETE'),
    reqUndoFolderDeletion: (folderId)=>_fetch(`/undo-folder-deletion/${folderId}`, 'PATCH'),
    reqGetDeletedFolders: ()=>_fetch('/deleted-folders'),

    reqPermanentDeleteFile: (fileId)=>_fetch(`/files/${fileId}`, 'DELETE'),
    reqMoveFile: (fileId, newFatherFolderId)=>_fetch('/move-file', 'PATCH', {}, {fileId, newFatherFolderId}),
    reqDeleteFile: (fileId)=>_fetch(`/delete-file/${fileId}`, 'DELETE'),
    reqUndoFileDeletion: (fileId)=>_fetch(`/undo-file-deletion/${fileId}`, 'PATCH'),
    reqGetFileList: (folderId)=>_fetch(`/files`, 'GET', {folderId}, {}),
    reqGetDeletedFiles: ()=>_fetch('/deleted-files'),

    reqDownloadFile: (fileId)=>fetch( `${BACK_END_URL}/files/${fileId}`, {credentials: 'include'}),
    reqDownloadFolder: (folderId)=>fetch(`${BACK_END_URL}/folders/${folderId}`, {credentials: 'include'}),
}