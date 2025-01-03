import { createSlice } from "@reduxjs/toolkit";

const loginStore = createSlice({
    name: "loginStatusRecord",  //0: 初始, -1:失败, 1:成功, 2:管理员
    initialState: {
        loginStatus: 0,
        userName: '',
    },
    reducers: {
        setLoginStatus(state, action){
            state.loginStatus = action.payload;
        },
        setUserName(state, action){
            state.userName = action.payload;
        }
    }
});

const {setLoginStatus, setUserName} = loginStore.actions;

export {setLoginStatus, setUserName}
export default loginStore.reducer