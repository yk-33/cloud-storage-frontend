'use client'
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '@/api';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import Icons from '../icon/icon';
import Tooltip from '@mui/material/Tooltip';
import { BACK_END_URL, PICTURE_TYPE } from '@/config/config';
import { useRouter, usePathname } from 'next/navigation';
const { reqGetThumbnail } = api;



export default function ItemDetailCard({ detailCardData }) {
    const [noPic, setNoPic] = useState(false)
    const pathName = usePathname()

    let dataEmpty = false;
    let showType = 'normal'
    let fileType = detailCardData.fileType
    //// console.log(detailCardData, pathName)
    if (Object.keys(detailCardData).length === 0) {
        if(pathName === '/trash'){
            dataEmpty = true;
            fileType = 'trash'
        }
        else if(pathName === '/search'){
            dataEmpty = true;
            fileType = 'search'
        }
        else{
            dataEmpty = true;
            fileType = 'trash'
        }
    }
    else if (!noPic) {
        if (PICTURE_TYPE.has(fileType)) {
            showType = 'picture'
        }
        else if (detailCardData.thumbnailName && (detailCardData.thumbnailName !== null)) {
            showType = 'thumbnail'
        }
    }

    //// console.log(detailCardData)

    let detailList = []

    if (!dataEmpty) {
        if (detailCardData.fileType === 'folder') {
            detailList.push({
                name: 'Type ',
                value: 'Folder'
            },
            )
        }
        else {
            detailList.push({
                name: 'Type ',
                value: detailCardData.fileType,
            })
            if (detailCardData.duration !== null) {
                detailList.push({
                    name: 'Duration',
                    value: detailCardData.duration,
                })
            }
            detailList.push({
                name: 'Size',
                value: detailCardData.fileSize,
            }, {
                name: 'Created',
                value: detailCardData.createdTime,
            },
            )
        }
        if (detailCardData.path !== null && detailCardData.path !== undefined) {
            detailCardData.path[0] = 'My Drive'
            detailList.push({
                name: 'Path',
                value: detailCardData.path.join(' / ') + ' /',
            })
        }
    }


    return (
        <Stack sx={{
            width: "320px", pt: "8px", ml: "16px", bgcolor: 'background.paper', color: 'text.secondary',
            borderRadius: '15px', flexShrink: 0
        }}>
            <Box sx={{ display: "flex", height: "64px", alignItems: 'center', pl: '16px', pr: '16px', flexShrink: 0 }}>
                <Icons type={fileType} />
                <Tooltip title={detailCardData.name} disableInteractive>
                    <Typography variant="subtitle1" noWrap sx={{ ml: '8px' }}>
                        {dataEmpty ? fileType : detailCardData.name}
                    </Typography>
                </Tooltip>
            </Box>
            <Divider />
            <Box sx={{ overflow: 'auto' }}>
                <Box sx={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        showType === 'normal' ?
                            <Icons type={fileType} sx={{ fontSize: 80 }} /> :
                            (
                                showType === 'picture' ?
                                    <img src={`${BACK_END_URL}/picture/${detailCardData.id}`}
                                        onError={() => { setNoPic(true) }}
                                        style={{ maxHeight: '200px', maxWidth: '300px' }}
                                    /> :
                                    <img src={`${BACK_END_URL}/thumbnail/${detailCardData.thumbnailName}`}
                                        onError={() => { setNoPic(true) }}
                                        style={{ maxHeight: '200px' }}
                                    />
                            )
                    }
                </Box>
                <Divider />
                <Stack spacing={1} sx={{ mt: '8px', pl: '16px' }}>
                    {
                        !dataEmpty &&
                        <Box>
                            <Typography variant="subtitle1" >
                                {'Details'}
                            </Typography>

                        </Box>
                    }

                    {
                        detailList.map((item, index) =>
                            <Box key={index}>
                                <Typography variant="caption" >
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" >
                                    {item.value}
                                </Typography>
                            </Box>
                        )
                    }
                </Stack>
            </Box>
        </Stack>
    )
}
