import { configureStore } from "@reduxjs/toolkit";
import folderReducer from "./modules/folderStore";
import folderSelectReducer from "./modules/folderSelectStore";
import folderExpandReducer from "./modules/folderExpandStore";
import loginReducer from "./modules/loginStore";


const store = configureStore({
    reducer: {
        folder: folderReducer,
        folderSelect: folderSelectReducer,
        folderExpand: folderExpandReducer,
        login: loginReducer,
    }
})

export default store;