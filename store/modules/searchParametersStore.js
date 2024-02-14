import { createSlice } from "@reduxjs/toolkit";

const searchParametersStore = createSlice({
    name: "searchParameters",
    initialState: {
        itemName: '',
        fileTypeIndex: 0,
        dateCreatedIndex: 0,
        searchPageKey: 0,
    },
    reducers: {
        setItemName(state, action){
            state.itemName = action.payload
        },
        setFileTypeIndex(state, action){
            state.fileTypeIndex = action.payload
        },
        setDateCreatedIndex(state, action){
            state.dateCreatedIndex = action.payload
        },
        setSearchPageKey(state, action){
            state.searchPageKey = action.payload
        }
    }
})

const {setItemName, setFileTypeIndex, setDateCreatedIndex, setSearchPageKey} = searchParametersStore.actions

export {setItemName, setFileTypeIndex, setDateCreatedIndex, setSearchPageKey}
export default searchParametersStore.reducer
