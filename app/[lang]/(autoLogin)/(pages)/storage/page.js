'use client'
import React, { useEffect } from "react";
import { setItemName, setFileTypeIndex, setDateCreatedIndex } from '@/store/modules/searchParametersStore';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/api';
import DataDisplayPage from "@/components/dataDispalyPage/dataDisplayPage";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import { processActionResponse, processResponse } from "@/utils/processResponseUtils";
import { Stack, Box, Typography, Tooltip } from "@mui/material";
import WhiteTooltip from "@/components/whiteTooltip/whiteTooltip";
import { tooltipClasses } from '@mui/material/Tooltip';
import { BorderHorizontalTwoTone } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
let { reqGetFileList, reqDeleteFile, reqGetAllFileList, reqGetDeletedFiles } = api;
import { SEARCH_TYPE, TOTAL_STORAGE_PER_USER_BYTE } from "@/config/config";
import { filesize } from "filesize";
import Divider from '@mui/material/Divider';
import Image from 'next/image'
import { emptyPageImageUrl } from '@/config/config';
import { useTranslation } from '@/international/myTranslate';
import { setAlertStatus } from "@/store/modules/alertStore";


const EmptyComponent = (pageName) => {
    const { t, lang } = useTranslation()
    return (
            <Stack sx={{alignItems: 'center'}}>
                <Image
                    src={emptyPageImageUrl['storage']}
                    alt=""
                    width={200}
                    height={200}
                />
                <Typography variant="h6" fontFamily={'"Noto Sans"'} sx={{mt: '15px'}}>
                    {t('No files are using storage')}
                </Typography>
            </Stack>
        )
}

export default function StoragePage() {
    const dispatch = useDispatch();
    const { t, lang } = useTranslation()
    const [fileList, setFileList] = React.useState([])
    const [storagePageKey, setStoragePageKey] = React.useState(0)
    const [dataDisplayPageKey, setDataDisplayPageKey] = React.useState(0)
    const [storageValue, setStorageValue] = React.useState({
        "Picture": 0, "Document": 0, "Audio": 0,
        "Video": 0, "Trash": 0, "Available": TOTAL_STORAGE_PER_USER_BYTE,
    })
    const [usedStorage, setUsedStorage] = React.useState(0)
    const [initializing, setInitializing] = React.useState(true)

    const fileUsage = [
        { label: "Picture", color: "#EF5350", zIndex: 6 }, 
        { label: "Document", color: "#42A5F5", zIndex: 5 }, 
        { label: "Audio", color: "#FBBC04", zIndex: 4 }, 
        { label: "Video", color: "#5C6BC0", zIndex: 3 }, 
        { label: "Trash", color: "#424242", zIndex: 2 }, 
        { label: "Available", color: "#F2F2F2", zIndex: 1 }, 
    ];

    const fieldData = [
        { name: 'Files using Drive storage', dataName: 'name', sort: false },
        { name: 'Storage used', dataName: 'fileSize', sort: false, },
    ]

    const menuData = {
        'file': [
            [
                {
                    name: 'Delete',
                    icon: <DeleteIcon />,
                    action: async (id, name) => {
                        // console.log(`menu${id}`)
                        if(id === null){
                            return
                        }
                        let res = await reqDeleteFile(id)
                        // console.log(res)
                        processActionResponse(res, dispatch, {
                            200: { message: t('File moved to trash'), action: 1 },
                            450: { message: t('Can not delete file that is not existing'), action: 2 },
                        })
                        setStoragePageKey(uuidv4())
                    },
                }
            ],
        ],
    }

    const TitleComponent = () => {
        const calculateSegments = () => {
            let cumulativePercentage = 0;
            return fileUsage.map((item) => {
                const startPercentage = cumulativePercentage;
                const widthPercentage = (storageValue[item.label] / TOTAL_STORAGE_PER_USER_BYTE) * 100;
                cumulativePercentage += widthPercentage;
                return {
                    ...item,
                    startPercentage,
                    widthPercentage,
                };
            });
        };

        const handleMouseEnter = (e) => {

        };

        const handleMouseLeave = (e) => {

        };

        return (
            <Box sx={{ p: 3, width: '100%', mx: "auto" }}>
                <Typography variant="h5" fontFamily={'"Noto Sans"'} gutterBottom>
                    {t('Storage')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: '5px' }}>
                    <Typography variant="h4" color='black'>{`${filesize(usedStorage, { base: 2, standard: "jedec" })}`}</Typography>
                    <Typography variant="body2" sx={{ml: '5px'}}>{
                    lang=="en"?`of ${filesize(TOTAL_STORAGE_PER_USER_BYTE, { base: 2, standard: "jedec" })} used` :
                    `/${filesize(TOTAL_STORAGE_PER_USER_BYTE, { base: 2, standard: "jedec" })} 使用中`}</Typography>
                </Box>
                {/* 容量条容器 */}
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: 5,
                        backgroundColor: 'white',
                        display: "flex",
                    }}
                >
                    {/* 显示每个段 */}
                    {calculateSegments().map((segment, index) => (
                        storageValue[segment.label] !== 0 &&
                        <WhiteTooltip
                            title={
                                <Stack sx={{width: '150px', height: '80px', alignItems: 'center', pt:'10px' }}>
                                    <Typography variant="caption" color='text.secondary' sx={{mb: '4px'}}>
                                    {t(`${segment.label.toUpperCase()}`)}
                                </Typography>
                                <Typography variant="h5">
                                    {`${filesize(storageValue[segment.label], { base: 2, standard: "jedec" })}`}
                                </Typography>
                                </Stack>
                            }
                            placement="bottom"
                            arrow
                            sx={{ mt: 2 }}
                        >
                            <Box
                                key={index}
                                onMouseEnter={() => handleMouseEnter()}
                                onMouseLeave={() => handleMouseLeave()}
                                sx={{
                                    flex: `${segment.widthPercentage} 0 auto`,
                                    minWidth: '25px',
                                    backgroundColor: 'white',
                                    transition: "all 0.3s",
                                    cursor: "pointer",
                                    marginRight: '-10px',
                                    boxSizing: 'border-box',
                                    zIndex: segment.zIndex,
                                    borderRadius: '5px',
                                    display: "flex",
                                    height: '12px',
                                    '&:hover': {
                                        zIndex: 10,
                                        boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
                                    }
                                }}
                            >
                                <Box sx={{
                                    width: '100%', margin: '2px', borderRadius: '5px',
                                    backgroundColor: segment.color
                                }} />
                            </Box>
                        </WhiteTooltip>
                    ))}
                </Box>

                {/* 文件类型说明 */}
                <Box sx={{ display: 'flex', mt: '5px', overflow: 'auto' }}>
                    {fileUsage.map((item, index) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: '16px' }}>
                            <Box sx={{
                                height: '8px', width: '8px', borderRadius: '4px'
                                , backgroundColor: item.color, mr: '8px'
                            }} />
                            <Typography>{t(item.label)}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }



    const getData = async () => {
        let [res, trashRes] = await Promise.all([reqGetAllFileList(), reqGetDeletedFiles(true)])
        processResponse(res, dispatch)
        processResponse(trashRes, dispatch)
        if (res.data !== null && trashRes.data !== null) {
            setFileList(res.data.fileList)
            setDataDisplayPageKey(uuidv4())
            let newStorageValue = {
                "Picture": 0, "Document": 0, "Audio": 0,
                "Video": 0, "Trash": 0, "Available": 0,
            }
            res.data.fileList.forEach(item => {
                let fileType = item.fileType.toLowerCase()
                if (SEARCH_TYPE['Photos & images'].includes(fileType)) {
                    newStorageValue["Picture"] += item.fileSize
                }
                else if (SEARCH_TYPE['PDFs'].includes(fileType) || SEARCH_TYPE['Documents'].includes(fileType) ||
                    SEARCH_TYPE['Archives'].includes(fileType)) {
                    newStorageValue["Document"] += item.fileSize
                }
                else if (SEARCH_TYPE['Audio'].includes(fileType)) {
                    newStorageValue["Audio"] += item.fileSize
                }
                else if (SEARCH_TYPE['Videos'].includes(fileType)) {
                    newStorageValue["Video"] += item.fileSize
                }
            })
            let trashValue = 0
            trashRes.data.deletedFiles.forEach(item=>{
                trashValue += item.fileSize
            })
            newStorageValue["Trash"] = trashValue
            newStorageValue["Available"] = TOTAL_STORAGE_PER_USER_BYTE - newStorageValue["Picture"] -
                newStorageValue["Document"] - newStorageValue["Audio"] - newStorageValue["Video"] -
                newStorageValue["Trash"]

            setStorageValue(newStorageValue)
            setUsedStorage(TOTAL_STORAGE_PER_USER_BYTE - newStorageValue["Available"])
            setInitializing(false)
        }
    }

    useEffect(() => {
        getData()
        dispatch(setItemName(''))
        dispatch(setFileTypeIndex(0))
        dispatch(setDateCreatedIndex(0))
    }, [storagePageKey])


    return (
        <>
            <DataDisplayPage key={dataDisplayPageKey} fielddata={fieldData} listdata={fileList}
                menudata={menuData}  TitleComponent={TitleComponent}
                EmptyComponent={fileList.length===0 ? EmptyComponent : null}
                initializing={initializing}
            />
        </>
    );
}