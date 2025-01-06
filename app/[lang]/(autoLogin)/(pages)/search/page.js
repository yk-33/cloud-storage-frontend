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
import { SEARCH_TYPE, searchFileType, searchDateCreated } from '@/config/config';
import { useRouter, usePathname } from 'next/navigation';
import { setSearchPageKey, setItemName, setFileTypeIndex, setDateCreatedIndex } from '@/store/modules/searchParametersStore';
import CommonDialog from '@/components/commonDialog/commonDialog';
import Image from 'next/image'
import { emptyPageImageUrl } from '@/config/config';
import { newDesUrl } from '@/utils/urlFunctions';
import { useTranslation } from '@/international/myTranslate';
import { setAlertStatus } from '@/store/modules/alertStore';

let { reqGetFileList, reqDeleteFile, reqDeleteFolder, reqMoveFolder, reqMoveFile, reqGetFolderStructure,
    reqDownloadFile, reqDownloadFolder, reqSearchFiles, reqSearchFolders, reqRenameFolder, reqRenameFile, 
 } = api;

 const TitleComponent = ()=>{
    const { t, lang } = useTranslation()
    return (
        <Box sx={{ p: 3, pb:'8px', width: '100%', mx: "auto" }}>
            <Typography variant="h5" fontFamily={'"Noto Sans"'} gutterBottom>
                {t('Search results')}
            </Typography>
        </Box>
    )
}

 const EmptyComponent = (pageName) => {
    const { t, lang } = useTranslation()
    return (
        <Stack sx={{alignItems: 'center'}}>
            <Image
                src={emptyPageImageUrl['search']}
                alt=""
                width={200}
                height={200}
            />
            <Typography variant="h5" fontFamily={'"Noto Sans"'} sx={{mt: '15px'}}>
                {t('No matching results')}
            </Typography>
        </Stack>
    )
}

export default function Home() {
    const dispatch = useDispatch();
    const { t, lang } = useTranslation()
    const { folderStructor } = useSelector(state => state.folder);
    const { folderSelectValue } = useSelector(state => state.folderSelect);
    const {itemName, fileTypeIndex, dateCreatedIndex, searchPageKey} = useSelector(state=>state.searchParameters)
    const router = useRouter()
    const pathname = usePathname()
    const [fileList, setFileList] = useState([])
    const [folderList, setFolderList] = useState([])
    const [folderBrowserDialogOpen, setFolderBrowserDialogOpen] = useState(false)
    const [moveItemId, setMoveItemId] = useState(null)
    const [moveItemType, setMoveItemType] = useState(null)
    const [moveItemName, setMoveItemName] = useState(null)
    const [renameDialogOpen, setRenameDialogOpen] = useState(false)
    const [renameItemId, setRenameItemId] = useState(null)
    const [renameItemType, setRenameItemType] = useState(null)
    const [renameItemName, setRenameItemName] = useState(null)
    const [dataDisplayPageKey, setDataDisplayPageKey] = React.useState(0)
    const [folderNotExist, setFolderNotExist] = React.useState(false)
    const [nameAsc, setNameAsc] = useState(true)
    const [initializing, setInitializing] = useState(true)


    let moveFolderId = moveItemId
    if (moveItemType !== 'folder') {
        moveFolderId = null
    }

    const fieldData = [
        { name: 'Name', dataName: 'name', sort: true, state: nameAsc, action: setNameAsc},
        { name: 'File type', dataName: 'fileType', sort: false, },
        { name: 'File size', dataName: 'fileSize', sort: false, },
        { name: 'Created time', dataName: 'createdTime', sort: false, },
        //{ name: 'Updated time', dataName: 'updatedTime', sort: true, },
    ]

    const menuData = {
        'folder': [
            [
                {
                    name: 'Download',
                    icon: <DownloadIcon />,
                    action: async (id, name) => {
                        // console.log(`folder${id}`)
                        try {
                            let res = await reqDownloadFolder(id)
                            if(res.status === 509){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("Too many requests, please try again later.")}))
                                return
                            }
                            else if(res.status === 429){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("The system is busy, please try again later.")}))
                                return
                            }
                            else if(res.status === 503){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("Service unavailable")}))
                                return
                            }
                            else if(res.status === 406){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("Folder not exist")}))
                                return
                            }
                            let data = await res.blob()
                            // console.log(data)
                            if(data.type === 'application/json'){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message:t("Please login") }))
                                dispatch(setLoginStatus(-1))
                                return
                            }
                            // else if(data.type !== ""){
                            //     handleAlertOpen("The folder does not exist", 'error')
                            //     return
                            // }
                            const fileUrl = window.URL.createObjectURL(data)
                            const link = document.createElement('a')
                            link.href = fileUrl
                            link.download = `${name}.zip`
                            link.click()
                            window.URL.revokeObjectURL(fileUrl)
                        } catch {
                            dispatch(setAlertStatus({open: true, alertType: 'error', message: t('Network failure')}))
                        }
                    },
                },
                {
                    name: 'Rename',
                    icon: <DriveFileRenameOutlineIcon />,
                    action: (id, name) => { 
                        setRenameItemId(id)
                        setRenameItemName(name)
                        setRenameItemType('folder')
                        setRenameDialogOpen(true)
                    },
                },
            ],
            [
                {
                    name: 'Move',
                    icon: <DriveFileMoveIcon />,
                    action: (id, name) => {
                        // console.log(`menu${id}`)
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
                        // console.log(`menu${id}`)
                        let res = await reqDeleteFolder(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: t('Folder moved to trash'), action: 1 },
                            450: { message: t('Can not delete folder that is not existing'), action: 1},
                        })
                        dispatch(setSearchPageKey(uuidv4()))
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
                        // console.log(`menu${id}`)
                        try {
                            let res = await reqDownloadFile(id)
                            if(res.status === 509){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("Too many requests, please try again later.")}))
                                return
                            }
                            else if(res.status === 429){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("The system is busy, please try again later.")}))
                                return
                            }
                            else if(res.status === 503){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("Service unavailable")}))
                                return
                            }
                            else if(res.status === 406){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("File not exist")}))
                                return
                            }
                            let data = await res.blob()
                            if(data.type === 'application/json'){
                                dispatch(setAlertStatus({open: true, alertType: 'error', message: t("Please login")}))
                                dispatch(setLoginStatus(-1))
                                return
                            }
                            // else if(data.type !== ""){
                            //     handleAlertOpen("The file does not exist", 'error')
                            //     return
                            // }
                            const fileUrl = window.URL.createObjectURL(data)
                            const link = document.createElement('a')
                            link.href = fileUrl
                            link.download = `${name}.${type}`
                            link.click()
                            window.URL.revokeObjectURL(fileUrl)
                        } catch {
                            dispatch(setAlertStatus({open: true, alertType: 'error', message: t('Network failure')}))
                        }
                    },
                },
                {
                    name: 'Rename',
                    icon: <DriveFileRenameOutlineIcon />,
                    action: (id, name) => { 
                        setRenameItemId(id)
                        setRenameItemName(name)
                        setRenameItemType('file')
                        setRenameDialogOpen(true)
                    },
                },
            ],
            [
                {
                    name: 'Move',
                    icon: <DriveFileMoveIcon />,
                    action: (id, name) => {
                        // console.log(`menu${id}`)
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
                        // console.log(`menu${id}`)
                        let res = await reqDeleteFile(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: t('File moved to trash'), action: 1 },
                            450: { message: t('Can not delete file that is not existing'), action: 1 },
                        })
                        dispatch(setSearchPageKey(uuidv4()))
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
        // console.log(moveItemId, newFatherFoderId)
        let res = null
        if (moveItemType === 'folder') {
            res = await reqMoveFolder(moveItemId, newFatherFoderId)
        }
        else {
            res = await reqMoveFile(moveItemId, newFatherFoderId)
        }
        // console.log(res)
        processActionResponse(res, dispatch, {
            200: { message: t('Move successful'), action: 2 },
            450: { message: `${t('Move failed')}: ${t(res.message)}`, action: 2 },
        })
        setFolderBrowserDialogOpen(false)
        router.push(newDesUrl(pathname, '/my-drive'))
    }

    const handleConfirmRename = async()=>{
        let res
        if(renameItemType === 'folder'){
            res = await reqRenameFolder(renameItemId, renameItemName)
        }
        else{
            res = await reqRenameFile(renameItemId, renameItemName)
        }
        processActionResponse(res, dispatch, {
            200: { message: `Renaming ${renameItemType} successful`, action: 1 },
            450: { message:`${t(`Renaming ${renameItemType} failed`)}: ${t(res.message)}`, action: 2 },
            409: { message:`${t(`Renaming ${renameItemType} failed`)}: ${t(res.message)}`, action: 1 },
        })
        setRenameDialogOpen(false)
        dispatch(setSearchPageKey(uuidv4()))
    }

    const updateItemList = async () => {
        let fileType = SEARCH_TYPE[searchFileType[fileTypeIndex].name]
        let dateCreated = searchDateCreated[dateCreatedIndex].value
        let [fileRes, folderRes] = await Promise.all([reqSearchFiles(itemName, fileType, dateCreated, nameAsc), 
            reqSearchFolders(itemName, fileType, dateCreated, nameAsc)])
        processResponse(folderRes, dispatch)
        processResponse(fileRes, dispatch)
        if(folderRes.data !== null && fileRes.data !== null){
            setFileList(fileRes.data.fileList)
            setFolderList(folderRes.data.folderList)
            setDataDisplayPageKey(uuidv4())
            setInitializing(false)
        }  
        setFolderBrowserDialogOpen(false)
        setMoveItemId(null)
        setMoveItemType(null)
        setMoveItemName(null)
    }

    useEffect(() => {
        updateItemList()
    }, [nameAsc, searchPageKey])

    // let formatedFolderList = []
    // for (let folder of folderList) {
    //     formatedFolderList.push({ fileType: 'folder', ...folder })
    // }
    // console.log(folderList)
    let listData = [...folderList, ...fileList]

    // console.log('listdata', listData)

    return (
        <>
            <DataDisplayPage key={dataDisplayPageKey}  fielddata={fieldData}
                listdata={listData} menudata={menuData} folderNotExist={folderNotExist}
                TitleComponent={TitleComponent} 
                EmptyComponent={listData.length===0 ? EmptyComponent : null }
                initializing={initializing}
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
            {
                renameDialogOpen && 
                <CommonDialog 
                    dialogValue={renameItemName}
                    dialogTitle={`Rename ${renameItemType}`}
                    dialogConfirmName={'OK'}
                    dialogOpen={renameDialogOpen}
                    handleInputChangeDialog={(e)=>setRenameItemName(e.target.value)}
                    handleCloseDialog={()=>setRenameDialogOpen(false)}
                    handleConfirmDialog={handleConfirmRename}
                />
            }
        </>
    )
}