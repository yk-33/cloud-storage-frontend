"use client"
import React, { useEffect, useState } from "react";
import api from '@/api';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DataDisplayPage from "@/components/dataDispalyPage/dataDisplayPage";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { updateFolderStructor} from '@/utils/updateStoreFunctions';
import {processActionResponse, processResponse} from "@/utils/processResponseUtils";
import { v4 as uuidv4 } from 'uuid';

const { reqGetDeletedFolders, reqGetDeletedFiles, reqUndoFolderDeletion, reqUndoFileDeletion,
    reqPermanentDeleteFolder, reqPermanentDeleteFile } = api

const fieldData = [
    { name: 'Name', dataName: 'name', sort: true, },
    { name: 'File type', dataName: 'fileType', sort: false, },
    { name: 'File size', dataName: 'fileSize', sort: true, },
    { name: 'Created time', dataName: 'createdTime', sort: true, },
]



export default function TrashPage() {
    const dispatch = useDispatch();
    const [listData, setListData] = useState([])
    const [trashPageKey, setTrashPageKey] = React.useState(0)
    const [dataDisplayPageKey, setDataDisplayPageKey] = React.useState(0)
    const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
    const { alertMessage, alertType, alertOpen } = alertState

    const handleAlertClose = (e) => {
        //e.stopPropagation()
        setAlertState({ ...alertState, alertOpen: false })
    }
    const handleAlertOpen = (alertMessage, alertType) => {
        setAlertState({ alertMessage, alertType, alertOpen: true })
    }

    const menuData = {
        'folder': [
            [
                {
                    name: 'Restore',
                    icon: <RestoreIcon />,
                    action: async (id) => {
                        console.log(`menu${id}`)

                        let res = await reqUndoFolderDeletion(id)
                        console.log(res)
                        processActionResponse(res, dispatch, handleAlertOpen, {
                            200: {message: '恢复文件夹成功', action: 1},
                            450: {message: `恢复文件夹失败` ,action: 0},
                        })
                        if (res.code === 200) {
                            setTrashPageKey(uuidv4())
                        }
                        else if (res.code === 450) {
                            setTrashPageKey(uuidv4())
                        }
                    },
                },
                {
                    name: 'Delete forever',
                    icon: <DeleteForeverIcon />,
                    action: async (id) => {
                        console.log(`menu${id}`)
                        let res = await reqPermanentDeleteFolder(id)
                        console.log(res)
                        processActionResponse(res, dispatch, handleAlertOpen, {
                            200: {message: '删除文件夹成功', action: 0},
                            450: {message: `删除文件夹失败` ,action: 0},
                        })
                        if (res.code === 200) {
                            setTrashPageKey(uuidv4())
                        }
                        else if (res.code === 450) {
                            setTrashPageKey(uuidv4())
                        }
                    },
                },
            ],
        ],
        'file': [
            [
                {
                    name: 'Restore',
                    icon: <RestoreIcon />,
                    action: async (id) => {
                        console.log(`menu${id}`)
                        let res = await reqUndoFileDeletion(id)
                        console.log(res)
                        processActionResponse(res, dispatch, handleAlertOpen, {
                            200: {message: '恢复文件成功', action: 1},
                            450: {message: `恢复文件失败` ,action: 0},
                        })
                        if (res.code === 200) {
                            setTrashPageKey(uuidv4())
                        }
                        else if (res.code === 450) {
                            setTrashPageKey(uuidv4())
                        }
                    },
                },
                {
                    name: 'Delete forever',
                    icon: <DeleteForeverIcon />,
                    action: async (id) => {
                        console.log(`menu${id}`)
                        let res = await reqPermanentDeleteFile(id)
                        console.log(res)
                        processActionResponse(res, dispatch, handleAlertOpen, {
                            200: {message: '删除文件成功', action: 0},
                            450: {message: `删除文件失败` ,action: 0},
                        })
                        if (res.code === 200) {
                            setTrashPageKey(uuidv4())
                        }
                        else if (res.code === 450) {
                            setTrashPageKey(uuidv4())
                        }
                    },
                },
            ],
        ],
    }

    const getData = async () => {
        let [folderRes, fileRes] = await Promise.all([reqGetDeletedFolders(), reqGetDeletedFiles()]);
        processResponse(folderRes, dispatch, handleAlertOpen)
        processResponse(fileRes, dispatch, handleAlertOpen)
        let folderList = []
        if(folderRes.data!==null){
            folderList = folderRes.data.deletedFolders;
        }
        let fileList = []
        if(fileRes.data!==null){
            fileList = fileRes.data.deletedFiles
        }
        // console.log("142",folderList, fileList)
        // let formatedFolderList = []
        // for (let folder of folderList) {
        //     formatedFolderList.push({ fileType: 'folder', ...folder })
        // }
        setListData([...folderList, ...fileList])
        setDataDisplayPageKey(uuidv4())
    }


    useEffect(() => {
        getData()
    }, [trashPageKey])
    return (
        <>
            <DataDisplayPage key={dataDisplayPageKey} fielddata={fieldData} listdata={listData}
                menudata={menuData}
            />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                open={alertOpen}
                onClose={(e) => handleAlertClose(e)}
            >
                <Alert severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>

    );
}