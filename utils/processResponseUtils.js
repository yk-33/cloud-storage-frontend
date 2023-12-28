import { updateFolderStructor, updateFolderStructorAndFolderSelect } from "./updateStoreFunctions"
import { setLoginStatus } from "@/app/store/modules/loginStore"

//action: 0: do nothing; 1:updateFolderStructor;  2: updateFolderStructorAndFolderSelect;
const processActionResponse = async (response, dispatch, handleAlertOpen, codeMap) => {
    let alertStatus = 'error'

    if(response.code===403){
        handleAlertOpen('需要登录', alertStatus)
        dispatch(setLoginStatus(-1))
        return
    }
    if (response.code === 503) {
        handleAlertOpen(response.message, alertStatus)
        return
    }

    if (response.code === 200) {
        alertStatus = 'success'
    }
    
    handleAlertOpen(codeMap.hasOwnProperty(response.code) ? codeMap[response.code].message : response.message, alertStatus)
    
    let action = codeMap[response.code].action
    if (action === 1) {
        await updateFolderStructor(dispatch, handleAlertOpen)
    }
    else if (action === 2) {
        await updateFolderStructorAndFolderSelect(dispatch, handleAlertOpen)
    }

}

const processResponse = (response, dispatch, handleAlertOpen) => {
    let alertStatus = 'error'
    if (response.code === 200) {
        alertStatus = 'success'
    }
    if (response.code === 403) {
        handleAlertOpen('需要登录', alertStatus)
        dispatch(setLoginStatus(-1))
    }
    else if (response.code === 503) {
        handleAlertOpen(response.message, alertStatus)
    }
}

export { processActionResponse, processResponse }