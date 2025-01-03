"use client"
import React, { useEffect, useState } from "react";
import api from '@/api';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DataDisplayPage from "@/components/dataDispalyPage/dataDisplayPage";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { updateFolderStructor } from '@/utils/updateStoreFunctions';
import { processActionResponse, processResponse } from "@/utils/processResponseUtils";
import { v4 as uuidv4 } from 'uuid';
import { setItemName, setFileTypeIndex, setDateCreatedIndex } from '@/store/modules/searchParametersStore';
import { Box, Stack, Typography } from "@mui/material";
import Image from 'next/image'
import { emptyPageImageUrl } from '@/config/config';
import { useTranslation } from '@/international/myTranslate';


const { reqGetDeletedFolders, reqGetDeletedFiles, reqUndoFolderDeletion, reqUndoFileDeletion,
    reqPermanentDeleteFolder, reqPermanentDeleteFile } = api

const TitleComponent = () => {
    const { t, lang } = useTranslation()
    return (
        <Box sx={{ p: 3, pb: '8px', width: '100%', mx: "auto" }}>
            <Typography variant="h5" fontFamily={'"Noto Sans"'} gutterBottom>
                {t('Trash')}
            </Typography>
        </Box>
    )
}

const EmptyComponent = (pageName) => {
    const { t, lang } = useTranslation()
    return (
        <Stack sx={{ alignItems: 'center' }}>
            <Image
                src={emptyPageImageUrl['trash']}
                alt=""
                width={200}
                height={200}
            />
            <Typography variant="h5" fontFamily={'"Noto Sans"'} sx={{ mt: '15px' }}>
                {t('Nothing in trash')}
            </Typography>
        </Stack>
    )
}

export default function TrashPage() {
    const dispatch = useDispatch();
    const { t, lang } = useTranslation()
    const [listData, setListData] = useState([])
    const [trashPageKey, setTrashPageKey] = React.useState(0)
    const [dataDisplayPageKey, setDataDisplayPageKey] = React.useState(0)
    const [nameAsc, setNameAsc] = useState(true)
    const [initializing, setInitializing] = useState(true)


    const fieldData = [
        { name: 'Name', dataName: 'name', sort: true, state: nameAsc, action: setNameAsc },
        { name: 'File type', dataName: 'fileType', sort: false, },
        { name: 'File size', dataName: 'fileSize', sort: false, },
        { name: 'Created time', dataName: 'createdTime', sort: false, },
    ]

    const menuData = {
        'folder': [
            [
                {
                    name: 'Restore',
                    icon: <RestoreIcon />,
                    action: async (id, name) => {
                        // console.log(`menu${id}`)
                        if (id === null) {
                            return
                        }
                        let res = await reqUndoFolderDeletion(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: lang==='en'?`Restored folder ${name}`:`${name} を復元しました`, action: 1 },
                            450: { message: t(`Failed to restore folder`), action: 0 },
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
                        // console.log(`menu${id}`)
                        let res = await reqPermanentDeleteFolder(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: t('Folder deleted forever'), action: 0 },
                            450: { message: t(`Folder deletion failed`), action: 0 },
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
                    action: async (id, name) => {
                        // console.log(`menu${id}`)
                        if (id === null) {
                            return
                        }
                        let res = await reqUndoFileDeletion(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: lang==='en'?`Restored file ${name}`:`${name} を復元しました`, action: 1 },
                            450: { message: t(`Failed to restore file`), action: 0 },
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
                        // console.log(`menu${id}`)
                        let res = await reqPermanentDeleteFile(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: t('File deleted forever'), action: 0 },
                            450: { message: t(`File deletion failed`), action: 0 },
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
        let [folderRes, fileRes] = await Promise.all([reqGetDeletedFolders(), reqGetDeletedFiles(nameAsc)]);
        processResponse(folderRes, dispatch)
        processResponse(fileRes, dispatch)
        let folderList = []
        if (folderRes.data !== null) {
            folderList = folderRes.data.deletedFolders;
            folderList.sort((a, b) => {
                if (nameAsc) {
                    return (a.name > b.name) ? 1 : -1
                }
                else {
                    return (b.name > a.name) ? 1 : -1
                }
            })
        }
        let fileList = []
        if (fileRes.data !== null) {
            fileList = fileRes.data.deletedFiles
        }
        // // console.log("142",folderList, fileList)
        // let formatedFolderList = []
        // for (let folder of folderList) {
        //     formatedFolderList.push({ fileType: 'folder', ...folder })
        // }
        if(folderRes.data !== null && fileRes.data !== null){
            setListData([...folderList, ...fileList])
            setDataDisplayPageKey(uuidv4())
            setInitializing(false)
        }
    }


    useEffect(() => {
        getData()
        dispatch(setItemName(''))
        dispatch(setFileTypeIndex(0))
        dispatch(setDateCreatedIndex(0))
    }, [trashPageKey, nameAsc])

    return (
        <>
            <DataDisplayPage key={dataDisplayPageKey} fielddata={fieldData} listdata={listData}
                menudata={menuData} TitleComponent={TitleComponent}
                EmptyComponent={listData.length === 0 ? EmptyComponent : null}
                initializing={initializing}
            />
        </>

    );
}