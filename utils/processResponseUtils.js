import { updateFolderStructor, updateFolderStructorAndFolderSelect } from "./updateStoreFunctions"
import { setLoginStatus } from "@/store/modules/loginStore"
import { setAlertStatus } from "@/store/modules/alertStore"

//action: 0: do nothing; 1:updateFolderStructor;  2: updateFolderStructorAndFolderSelect;
const processActionResponse = async (response, dispatch, codeMap) => {
    let alertType = 'error'

    if(response.code===403){
        dispatch(setAlertStatus({open: true, alertType: alertType, message: 'Please login'}))
        dispatch(setLoginStatus(-1))
        return
    }
    if (response.code === 503) {
        dispatch(setAlertStatus({open: true, alertType: alertType, message: response.message}))
        return
    }

    if (response.code === 200) {
        alertType = 'success'
    }
    
    dispatch(setAlertStatus({open: true, 
        alertType: alertType, 
        message: codeMap.hasOwnProperty(response.code)&&codeMap[response.code].message ? codeMap[response.code].message : response.message}))

    let action = codeMap[response.code].action
    if (action === 1) {
        await updateFolderStructor(dispatch)
    }
    else if (action === 2) {
        await updateFolderStructorAndFolderSelect(dispatch)
    }

}

const processResponse = (response, dispatch) => {
    
    let alertType = 'error'
    if (response.code === 200) {
        alertType = 'success'
    }
    if (response.code === 403) {
        dispatch(setAlertStatus({open: true, alertType: alertType, message: 'Please login'}))
        dispatch(setLoginStatus(-1))
    }
    else if (response.code === 503) {
        dispatch(setAlertStatus({open: true, alertType: alertType, message: response.message}))
    }
}

export { processActionResponse, processResponse }