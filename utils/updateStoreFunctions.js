import { useDispatch, useSelector } from 'react-redux';
import { fetchFolderStructor, setFolderStructor} from '@/store/modules/folderStore';
import { setFolderSelectValue } from '@/store/modules/folderSelectStore';
import { setFolderExpandValue } from '@/store/modules/folderExpandStore';
import { newFolderExpand } from './folderTreeUtils';
import { setAlertStatus } from '@/store/modules/alertStore';
import api from '../api/index'
const {reqGetFolderStructure} = api

const updateFolderStructor = async(dispatch)=>{
    let res = await reqGetFolderStructure()
    if(res.code===403){
        dispatch(setAlertStatus({open: true, alertType: 'error', message: '需要登录'}))
        dispatch(setLoginStatus(-1))
        return
    }
    else if (res.code === 503) {
        dispatch(setAlertStatus({open: true, alertType: 'error', message: res.message}))
        return
    }
    let folderStructor = res.data.rootFolderNode
    folderStructor.name = "My Drive"
    //let newFolderExpandValue = newFolderExpand(folderStructor, folderExpandValue)
    dispatch(setFolderExpandValue([]))
    dispatch(setFolderStructor(folderStructor))
}

const updateFolderStructorAndFolderSelect =async(dispatch)=>{
    let res = await reqGetFolderStructure()
    if(res.code===403){
        dispatch(setAlertStatus({open: true, alertType: 'error', message: '需要登录'}))
        dispatch(setLoginStatus(-1))
        return
    }
    else if (res.code === 503) {
        dispatch(setAlertStatus({open: true, alertType: 'error', message: res.message}))
        return
    }
    let folderStructor = res.data.rootFolderNode
    folderStructor.name = "My Drive"
    //let newFolderExpandValue = newFolderExpand(folderStructor, folderExpandValue)
    dispatch(setFolderExpandValue([]))
    dispatch(setFolderStructor(folderStructor))
    dispatch(setFolderSelectValue(folderStructor.id))
}



export {updateFolderStructor, updateFolderStructorAndFolderSelect}