import { useDispatch, useSelector } from 'react-redux';
import { fetchFolderStructor, setFolderStructor} from '@/app/store/modules/folderStore';
import { setFolderSelectValue } from '@/app/store/modules/folderSelectStore';
import { setFolderExpandValue } from '@/app/store/modules/folderExpandStore';
import { newFolderExpand } from './folderTreeUtils';
import api from '../api/index'
const {reqGetFolderStructure} = api

const updateFolderStructor = async(dispatch, handleAlertOpen)=>{
    let res = await reqGetFolderStructure()
    if(res.code===403){
        handleAlertOpen('需要登录', 'error')
        dispatch(setLoginStatus(-1))
        return
    }
    else if (res.code === 503) {
        handleAlertOpen(res.message, 'error')
        return
    }
    let folderStructor = res.data.rootFolderNode
    folderStructor.name = "My Drive"
    //let newFolderExpandValue = newFolderExpand(folderStructor, folderExpandValue)
    dispatch(setFolderExpandValue([]))
    dispatch(setFolderStructor(folderStructor))
}

const updateFolderStructorAndFolderSelect =async(dispatch, handleAlertOpen)=>{
    let res = await reqGetFolderStructure()
    if(res.code===403){
        handleAlertOpen('需要登录', 'error')
        dispatch(setLoginStatus(-1))
        return
    }
    else if (res.code === 503) {
        handleAlertOpen(res.message, 'error')
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