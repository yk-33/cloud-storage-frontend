'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { getFolderPath, getFolders } from '@/utils/folderTreeUtils';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';

const itemStyle = {
    'selected':{
        height: "40px",
        bgcolor: 'custom.blue',
        justifyContent: 'space-between',
    },
    'normal':{
        height: "40px",
        '&:hover': {
            bgcolor: "action.hover"
        },
        justifyContent: 'space-between',
    }
}

export default function FolderBrowser(props) {
    const { folderBrowserDialogOpen, handleCloseFolderBrowserDialog, handleClickMoveFolder,
         moveFolderId, moveItemName} = props
    const dispatch = useDispatch();
    const { folderStructor } = useSelector(state => state.folder);
    const { folderSelectValue } = useSelector(state => state.folderSelect);

    const [rootFolderId, setRootFolderId] = useState()
    const [hoverFolderId, setHoverFolderId] = useState()
    const [selectedFolderId, setSelectedFolderId] = useState()

    const { folderPath, folderList } = useMemo(() => {
        const folderPath = getFolderPath(folderStructor, rootFolderId)
        const { folderList } = getFolders(folderStructor, rootFolderId)
        const folderListWithOutTargetFolder = folderList.map((item)=>{
            if(item.id !== moveFolderId){
                return item
            }
        }).filter(item=>item!==undefined)
        return { folderPath, folderList:  folderListWithOutTargetFolder}
    }, [folderStructor, rootFolderId])

    useEffect(() => {
        setRootFolderId(folderStructor.id)
        setSelectedFolderId(folderStructor.id)
    }, [folderStructor])


    console.log(folderStructor, rootFolderId, folderPath, folderList)


    const handleMouseEnterFolder = (id) => {
        setHoverFolderId(id)
    }

    const handleMouseLeaveFolder = () => {
        setHoverFolderId(null)
    }

    const handleSelectFolder = (id) => {
        setSelectedFolderId(id)
    }
    const handleClickFolder = (e, id) => {
        e.stopPropagation()
        switch (e.detail) {
            case 1:
                setSelectedFolderId(id)
                break
            case 2:
                setRootFolderId(id)
                break
        }
    }

    const handleClickBack = (e) => {
        e.stopPropagation()
        setRootFolderId(folderPath[folderPath.length - 2].id)
        setSelectedFolderId(folderPath[folderPath.length - 2].id)
    }
    const handleClickDialog = ()=>{
        console.log(123)
        if(folderPath.length>0){
            setSelectedFolderId(folderPath[folderPath.length - 1].id)
        } 
    }

    return (
        <Dialog open={folderBrowserDialogOpen} onClose={handleCloseFolderBrowserDialog} onClick={handleClickDialog} maxWidth={'md'}>
            <DialogTitle sx={{width: '616px', typography:'h6', userSelect: 'none' }} noWrap>{`Move "${moveItemName}"`}</DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={handleCloseFolderBrowserDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", userSelect: 'none' }}>
                {
                    folderPath.length === 1 ?
                    <IconButton onClick={handleClickBack} sx={{visibility: 'hidden'}}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                     :
                    <IconButton onClick={handleClickBack}>
                        <ArrowBackIcon  fontSize="small" />
                    </IconButton>
                }

                <Typography variant="subtitle1" >
                    {folderPath.length>0?folderPath[folderPath.length - 1].name : ''}
                </Typography>
            </Stack>
            <Divider />
            <DialogContent >
                <Stack sx={{ height: '270px', width: '616px', userSelect: 'none' }}>
                    {
                        folderList.map((item) =>
                            <Stack direction="row" spacing={1} key={item.id}
                                onMouseEnter={() => { handleMouseEnterFolder(item.id) }}
                                onMouseLeave={() => { handleMouseLeaveFolder() }}
                                onClick={(e) => { handleClickFolder(e, item.id) }}
                                sx={
                                    item.id === selectedFolderId ?
                                    itemStyle['selected']:
                                    itemStyle['normal']
                                }>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", pl: "8px" }}>
                                        <FolderIcon fontSize="small" />
                                    </Box>
                                    <Typography variant="body1" >
                                        {item.name}
                                    </Typography>
                                </Stack>
                                {
                                    (item.id === hoverFolderId || item.id === selectedFolderId) &&
                                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", pl: "8px" }}>
                                            <ArrowForwardIosIcon fontSize="small" />
                                        </Box>
                                    </Stack>
                                }
                            </Stack>
                        )
                    }

                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{m: '8px',}}>
                <Button onClick={(e)=>handleCloseFolderBrowserDialog(e)} size="small">Cancel</Button>
                <Button onClick={(e)=>handleClickMoveFolder(e, selectedFolderId)} 
                    size="small"
                    variant="contained"
                >Move</Button>
            </DialogActions>
        </Dialog>
    )
}