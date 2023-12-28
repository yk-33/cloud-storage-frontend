import { createSlice } from "@reduxjs/toolkit";
import api from '../../../api';
let {reqFolder, reqGetFolderStructure} = api;

const folderStore = createSlice({
    name: "folder",
    initialState: {
        folderStructor: {id:0, name:"My Drive", children: []}
    },
    reducers: {
        setFolderStructor(state, action){
            state.folderStructor = action.payload;
        }
    }
});

const {setFolderStructor} = folderStore.actions;

const fetchFolderStructor = ()=>{
    return async(dispatch)=>{
        const res = await reqGetFolderStructure()
        if(res.code===503){
            return
        }
        let rootFolderNode = res.data.rootFolderNode
        rootFolderNode.name = "My Drive"
        console.log(rootFolderNode)
        dispatch(setFolderStructor(rootFolderNode));
    }
}

export {fetchFolderStructor, setFolderStructor}
export default folderStore.reducer
