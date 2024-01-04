import { createSlice } from "@reduxjs/toolkit";

const folderExpandStore = createSlice({
    name: "folderExpand",
    initialState: {
        folderExpandValue: []
    },
    reducers: {
        setFolderExpandValue(state, action){
            state.folderExpandValue = action.payload;
        }
    }
});

const {setFolderExpandValue} = folderExpandStore.actions;

export {setFolderExpandValue}
export default folderExpandStore.reducer