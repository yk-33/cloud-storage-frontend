"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataDisplayPage from '@/components/dataDispalyPage/dataDisplayPage';
import { useDispatch, useSelector } from 'react-redux';
import { setFolderSelectValue } from '@/store/modules/folderSelectStore';
import api from '@/api';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { getFolderPath, getFolders, newFolderExpand } from '@/utils/folderTreeUtils';
import FolderBrowser from '@/components/folderBrowser/folderBrowser';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { updateFolderStructor, updateFolderStructorAndFolderSelect } from '@/utils/updateStoreFunctions';
import { setFolderExpandValue } from '@/store/modules/folderExpandStore';
import { fetchFolderStructor, setFolderStructor } from '@/store/modules/folderStore';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { processActionResponse, processResponse } from '@/utils/processResponseUtils';
import { setLoginStatus } from '@/store/modules/loginStore';
import { v4 as uuidv4 } from 'uuid';

let { reqGetFileList, reqDeleteFile, reqDeleteFolder, reqMoveFolder, reqMoveFile, reqGetFolderStructure,
    reqDownloadFile, reqDownloadFolder } = api;




const fieldData = [
    { name: 'Name', dataName: 'name', sort: true, },
    { name: 'File type', dataName: 'fileType', sort: false, },
    { name: 'File size', dataName: 'fileSize', sort: true, },
    { name: 'Created time', dataName: 'createdTime', sort: true, },
    //{ name: 'Updated time', dataName: 'updatedTime', sort: true, },
]



export default function Home() {
    const dispatch = useDispatch();
    const { folderStructor } = useSelector(state => state.folder);
    const { folderSelectValue } = useSelector(state => state.folderSelect);
    const [fileList, setFileList] = useState([])
    const [folderBrowserDialogOpen, setFolderBrowserDialogOpen] = useState(false)
    const [moveItemId, setMoveItemId] = useState(null)
    const [moveItemType, setMoveItemType] = useState(null)
    const [moveItemName, setMoveItemName] = useState(null)
    const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
    const { alertMessage, alertType, alertOpen } = alertState
    const [dataDisplayPageKey, setDataDisplayPageKey] = React.useState(0)
    const [folderNotExist, setFolderNotExist] = React.useState(false)


    const handleAlertClose = (e) => {
        //e.stopPropagation()
        setAlertState({ ...alertState, alertOpen: false })
    }
    const handleAlertOpen = (alertMessage, alertType) => {
        setAlertState({ alertMessage, alertType, alertOpen: true })
    }

    let moveFolderId = moveItemId
    if (moveItemType !== 'folder') {
        moveFolderId = null
    }

    const menuData = {
        'folder': [
            [
                {
                    name: 'Download',
                    icon: <DownloadIcon />,
                    action: async (id, name) => {
                        console.log(`folder${id}`)
                        try {
                            let res = await reqDownloadFolder(id)
                            let data = await res.blob()
                            console.log(data)
                            if(data.type === 'application/json'){
                                handleAlertOpen("请登录", 'error')
                                dispatch(setLoginStatus(-1))
                                return
                            }
                            else if(data.type !== ""){
                                handleAlertOpen("文件夹不存在", 'error')
                                return
                            }
                            const fileUrl = window.URL.createObjectURL(data)
                            const link = document.createElement('a')
                            link.href = fileUrl
                            link.download = `${name}.zip`
                            link.click()
                            window.URL.revokeObjectURL(fileUrl)
                        } catch {
                            handleAlertOpen('网络故障', 'error')
                        }
                    },
                },
                {
                    name: 'Rename',
                    icon: <DriveFileRenameOutlineIcon />,
                    action: (id, name) => { console.log(`menu${id}`) },
                },
            ],
            [
                {
                    name: 'Move',
                    icon: <DriveFileMoveIcon />,
                    action: (id, name) => {
                        console.log(`menu${id}`)
                        setMoveItemId(id)
                        setMoveItemName(name)
                        setMoveItemType('folder')
                        setFolderBrowserDialogOpen(true)
                    },
                },
            ],
            [
                {
                    name: 'Delete',
                    icon: <DeleteIcon />,
                    action: async (id, name) => {
                        console.log(`menu${id}`)
                        let res = await reqDeleteFolder(id)
                        console.log(res)
                        processActionResponse(res, dispatch, handleAlertOpen, {
                            200: { message: '删除文件夹成功', action: 1 },
                            450: { message: '删除文件夹失败: 文件夹不存在', action: 2 },
                        })
                    },
                }
            ],
        ],
        'file': [
            [
                {
                    name: 'Download',
                    icon: <DownloadIcon />,
                    action: async(id, name, type) => {
                        console.log(`menu${id}`)
                        try {
                            let res = await reqDownloadFile(id)
                            let data = await res.blob()
                            if(data.type === 'application/json'){
                                handleAlertOpen("请登录", 'error')
                                dispatch(setLoginStatus(-1))
                                return
                            }
                            else if(data.type !== ""){
                                handleAlertOpen("文件不存在", 'error')
                                return
                            }
                            const fileUrl = window.URL.createObjectURL(data)
                            const link = document.createElement('a')
                            link.href = fileUrl
                            link.download = `${name}.${type}`
                            link.click()
                            window.URL.revokeObjectURL(fileUrl)
                        } catch {
                            handleAlertOpen('网络故障', 'error')
                        }
                    },
                },
                {
                    name: 'Rename',
                    icon: <DriveFileRenameOutlineIcon />,
                    action: (id, name) => { console.log(`menu${id}`) },
                },
            ],
            [
                {
                    name: 'Move',
                    icon: <DriveFileMoveIcon />,
                    action: (id, name) => {
                        console.log(`menu${id}`)
                        setMoveItemId(id)
                        setMoveItemName(name)
                        setMoveItemType('file')
                        setFolderBrowserDialogOpen(true)
                    },
                },
            ],
            [
                {
                    name: 'Delete',
                    icon: <DeleteIcon />,
                    action: async (id, name) => {
                        console.log(`menu${id}`)
                        let res = await reqDeleteFile(id)
                        console.log(res)
                        processActionResponse(res, dispatch, handleAlertOpen, {
                            200: { message: '删除文件成功', action: 1 },
                            450: { message: '删除文件失败: 文件不存在', action: 2 },
                        })
                    },
                }
            ],
        ],
    }

    const handleCloseFolderBrowserDialog = (e) => {
        e.stopPropagation()
        setFolderBrowserDialogOpen(false)
    }
    const handleClickMoveFolder = async (e, newFatherFoderId) => {
        e.stopPropagation()
        console.log(moveItemId, newFatherFoderId)
        let res = null
        if (moveItemType === 'folder') {
            res = await reqMoveFolder(moveItemId, newFatherFoderId)
        }
        else {
            res = await reqMoveFile(moveItemId, newFatherFoderId)
        }
        console.log(res)
        processActionResponse(res, dispatch, handleAlertOpen, {
            200: { message: '移动成功', action: 2 },
            450: { message: `移动失败: ${res.message}`, action: 2 },
        })
        setFolderBrowserDialogOpen(false)
    }

    console.log(folderStructor)
    console.log(folderSelectValue)
    let folderPath = getFolderPath(folderStructor, folderSelectValue)
    console.log('folderpath', folderPath)

    const updateFileList = async () => {
        let res = await reqGetFileList(folderSelectValue)
        processResponse(res, dispatch, handleAlertOpen)
        if (res.data !== null) {
            setFileList(res.data.fileList)
            setFolderNotExist(false)
        }
        else {
            setFolderNotExist(true)
            setFileList([])
        }
        console.log(uuidv4())
        setDataDisplayPageKey(uuidv4())
        setFolderBrowserDialogOpen(false)
        setMoveItemId(null)
        setMoveItemType(null)
        setMoveItemName(null)
    }

    useEffect(() => {
        if (folderSelectValue === null) {
            return
        }
        updateFileList()

    }, [folderStructor, folderSelectValue])

    let { folderList } = getFolders(folderStructor, folderSelectValue)
    console.log(folderList)
    // let formatedFolderList = []
    // for (let folder of folderList) {
    //     formatedFolderList.push({ fileType: 'folder', ...folder })
    // }
    let listData = [...folderList, ...fileList]

    console.log('listdata', listData)

    return (
        <>
            <DataDisplayPage key={dataDisplayPageKey} folderpath={folderPath} fielddata={fieldData}
                listdata={listData} menudata={menuData} folderNotExist={folderNotExist}
            />
            {
                folderBrowserDialogOpen &&
                <FolderBrowser
                    folderBrowserDialogOpen={folderBrowserDialogOpen}
                    handleCloseFolderBrowserDialog={handleCloseFolderBrowserDialog}
                    handleClickMoveFolder={handleClickMoveFolder}
                    moveFolderId={moveFolderId}
                    moveItemName={moveItemName}
                />
            }
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
    )
}