import { createSlice } from "@reduxjs/toolkit";

const folderSelectStore = createSlice({
    name: "folderSelect",
    initialState: {
        folderSelectValue: null
    },
    reducers: {
        setFolderSelectValue(state, action){
            state.folderSelectValue = action.payload;
        }
    }
});

const {setFolderSelectValue} = folderSelectStore.actions;

export {setFolderSelectValue}
export default folderSelectStore.reducer