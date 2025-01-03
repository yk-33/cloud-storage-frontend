import { createSlice } from "@reduxjs/toolkit";

const alertStore = createSlice({
    name: "alertStatusRecord",  
    initialState: {
        alertStatus: {open: false, alertType: 'error', message: '!!!'}
    },
    reducers: {
        setAlertStatus(state, action){
            state.alertStatus = action.payload;
        },
    }
});

const {setAlertStatus} = alertStore.actions;

export {setAlertStatus}
export default alertStore.reducer