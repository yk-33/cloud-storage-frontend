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
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import Paper from '@mui/material/Paper';
import CommonMenu from '../commonMenu/commonMenu';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setFolderSelectValue } from '@/store/modules/folderSelectStore';
import { filesize } from "filesize";
import ItemDetailCard from './card';
import Icons from '../icon/icon';
import Tooltip from '@mui/material/Tooltip';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Empty } from 'antd';
import { grey } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';
import { useRouter, usePathname } from 'next/navigation';
import { setFileTypeIndex, setDateCreatedIndex, setSearchPageKey } from '@/store/modules/searchParametersStore';
import { searchFileType, searchDateCreated } from '@/config/config';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { newLanguageUrl, urlWithoutLanguage ,newDesUrl } from '@/utils/urlFunctions';
import { useTranslation } from '@/international/myTranslate';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const listItemStyle = {
    normal: {
        height: "40px",
        '&:hover': {
            bgcolor: "action.hover"
        },
    },
    clicked: {
        height: "40px",
        bgcolor: 'custom.blue',
    },
}



export default function DataDisplayPage({ initializing, folderpath, fielddata, listdata, menudata, folderNotExist,
    TitleComponent, EmptyComponent
}) {
    
    useEffect(() => {
        // console.log('DataDisplayPage重新加载')
    }, [])
    const dispatch = useDispatch();
    const { t, lang } = useTranslation()
    const { fileTypeIndex, dateCreatedIndex } = useSelector(state => state.searchParameters)
    const pathnameWithLang = usePathname()
    const pathName = urlWithoutLanguage(pathnameWithLang)
    const router = useRouter()

    
    let hasFolderPath = true
    if (folderpath === undefined) {
        hasFolderPath = false
    }
    
    console.log(folderpath)
    if(folderpath && folderpath.length!==0){
        folderpath[0] = {...folderpath[0], name: t('My Drive')}
    }
    
    //// console.log(fielddata, listdata)
    const headField = fielddata[0]
    const fields = fielddata.slice(1)
    //// console.log(fields)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedFileType, setSelectedFileType] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [selectedName, setSelectedName] = useState(null)
    const [pathListAnchorEl, setPathListAnchorEl] = React.useState(null);
    const [itemDetailCardKey, setItemDetailCardKey] = useState(0)

    const pathListOpen = Boolean(pathListAnchorEl);

    const handleClickPathList = (event) => {
        setPathListAnchorEl(event.currentTarget);
    };
    const handleClosePathList = () => {
        setPathListAnchorEl(null);
    };
    const handleClickPathListItem = (id) => {
        setPathListAnchorEl(null);
        dispatch(setFolderSelectValue(id))
    }

    const handleClickPathItem = (id) => {
        dispatch(setFolderSelectValue(id))
    }

    const open = Boolean(anchorEl);
    const handleClickMoreIcon = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickItem = (e, id, name, type) => {
        e.stopPropagation()
        // console.log('点击', id, type)
        if (id !== selectedId || type !== selectedFileType) {
            setItemDetailCardKey(uuidv4())
        }
        switch (e.detail) {
            case 1:
                setSelectedFileType(type)
                setSelectedId(id)
                setSelectedName(name)
                break
            case 2:
                if (type === 'folder') {
                    dispatch(setFolderSelectValue(id))
                    if (pathName === '/search') {
                        router.push(newDesUrl(pathnameWithLang, '/my-drive'))
                    }
                }
                break
        }
    }

    const handleDeleteIconFileType = () => {
        dispatch(setFileTypeIndex(0))
        dispatch(setSearchPageKey(uuidv4()))
    }

    const handleDeleteIconDateCreated = () => {
        dispatch(setDateCreatedIndex(0))
        dispatch(setSearchPageKey(uuidv4()))
    }

    let thisMenuData = menudata[selectedFileType]
    if (thisMenuData === undefined) {
        thisMenuData = menudata['file']
    }

    let pathCollapsed = false
    let collapsedPath = []
    if (folderpath?.length > 2) {
        pathCollapsed = true
        collapsedPath = folderpath.slice(0, folderpath.length - 1)
        folderpath = [folderpath[folderpath.length - 1]]
    }


    listdata = listdata.map(listItem => {
        if (listItem.hasOwnProperty('fileSize')) {
            let fileSize = Number(listItem.fileSize)
            return { ...listItem, fileSize: filesize(fileSize, { base: 2, standard: "jedec" }) }
        }
        else {
            return listItem
        }
    })
    //// console.log('list',listdata)
    let detailCardData = {}
    if (folderpath && folderpath.length !== 0) {
        detailCardData = folderpath[folderpath.length - 1]
    }
    
    if (selectedId !== null) {
        listdata.forEach(item => {
            if (item.fileType === selectedFileType && item.id === selectedId) {
                detailCardData = item
            }
        });
    }

    let searchArray = []
    if (pathName === '/search') {
        if (fileTypeIndex !== 0) {
            searchArray.push(<Chip
                label={t(searchFileType[fileTypeIndex].name)}
                key="fileType" color="secondary"
                onDelete={handleDeleteIconFileType}
            />)
        }
        if (dateCreatedIndex !== 0) {
            searchArray.push(<Chip
                label={t(searchDateCreated[dateCreatedIndex].name)}
                key="dateCreated" color="secondary"
                onDelete={handleDeleteIconDateCreated}
            />)
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", bgcolor: "background.default", height: '100%' }}>
                <Box sx={{
                    flexGrow: 1, padding: "8px", display: "flex", flexDirection: "column", minWidth: 0,
                    bgcolor: 'background.paper', borderRadius: '15px', color: 'text.secondary', userSelect: 'none'
                }}>
                    {TitleComponent !== undefined && < TitleComponent />}
                    <Box sx={{ display: "flex", alignItems: 'center', mb: "8px", ml: '8px', flexShrink: 0 }}>
                        {
                            hasFolderPath ?
                                <Breadcrumbs aria-label="breadcrumb" sx={{ height: "64px", display: "flex", alignItems: 'center' }}
                                    separator={<NavigateNextIcon fontSize="small" />}>
                                    {
                                        pathCollapsed &&
                                        <StyledBreadcrumb
                                            icon={<MoreHorizIcon color='custom.black' />}
                                            onClick={handleClickPathList}
                                        />
                                    }
                                    {
                                        folderpath.map(item =>
                                            <StyledBreadcrumb
                                                key={item.id}
                                                label={//item.name
                                                    <Typography variant="h6" >
                                                        {item.name}
                                                    </Typography>
                                                }
                                                onClick={() => handleClickPathItem(item.id)}

                                            />
                                        )
                                    }
                                </Breadcrumbs> : (
                                    TitleComponent !== undefined ?
                                        <></> : < Box sx={{ height: "64px" }} />
                                )
                        }
                    </Box>
                    {
                        pathName === '/search' &&
                        <Stack direction={'row'} spacing={2}>
                            {searchArray}
                        </Stack>
                    }
                    {
                        initializing ?
                            <Box sx={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1,
                                overflow: 'auto'
                            }}>
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </Box> :
                            folderNotExist ?
                                <Box sx={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1,
                                    overflow: 'auto'
                                }}>
                                    <Empty description={<span style={{ color: grey[500] }}>  Folder not exist </span>} />
                                </Box> :
                                (EmptyComponent !== undefined && EmptyComponent !== null) ?
                                    <Box sx={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1,
                                        overflow: 'auto'
                                    }}>
                                        <EmptyComponent />
                                    </Box> :
                                    <Stack divider={<Divider />} sx={{ minHeight: 0, flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} sx={{
                                            height: "40px", flexShrink: 0,

                                        }}>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexGrow: 1 }}>
                                                <Typography variant="subtitle2" >
                                                    {t(headField.name)}
                                                </Typography>
                                                {
                                                    headField.sort &&
                                                    <IconButton size="small" onClick={() => headField.action(!headField.state)}>
                                                        {
                                                            headField.state ?
                                                                <ArrowUpwardIcon fontSize="small" /> :
                                                                <ArrowDownwardIcon fontSize="small" />
                                                        }
                                                    </IconButton>
                                                }
                                            </Stack>
                                            {
                                                fields.map((field, index) =>
                                                    <Stack key={index} direction="row" spacing={1}
                                                        sx={{ width: field.name === 'File type' ? "80px" : '100px', alignItems: "center" }}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {t(field.name)}
                                                        </Typography>
                                                        {
                                                            field.sort &&
                                                            <IconButton size="small">
                                                                <ArrowUpwardIcon fontSize="small" />
                                                            </IconButton>
                                                        }
                                                    </Stack>

                                                )
                                            }
                                            <IconButton size="small" sx={{ width: "40px", visibility: 'hidden' }}>
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                        <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
                                            {
                                                listdata.map((item, index) =>
                                                    <Stack key={index} direction="row"
                                                        onClick={(e) => handleClickItem(e, item.id, item.name, item.fileType)}
                                                        spacing={1} sx={(selectedId === item.id && selectedFileType === item.fileType) ?
                                                            listItemStyle['clicked'] : listItemStyle['normal']
                                                        }>

                                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexGrow: 1, minWidth: '100px', flexShrink: 1 }}>
                                                            <Box sx={{ display: "flex", alignItems: "center", pl: "8px" }}>
                                                                <Icons type={item.fileType.toLowerCase()} />
                                                            </Box>
                                                            <Tooltip title={item.name} disableInteractive>
                                                                <Typography variant="subtitle2" noWrap sx={{ overflow: 'hidden' }} >
                                                                    {item.name}
                                                                </Typography>
                                                            </Tooltip>

                                                        </Stack>
                                                        {
                                                            fields.map((field, index) =>
                                                                <Stack key={index} direction="row" spacing={1}
                                                                    sx={{ width: field.name === 'File type' ? "80px" : '100px', alignItems: "center", flexShrink: 0 }}>
                                                                    <Typography variant="body2" >
                                                                        {field.name === 'File type'&&item[field.dataName]==='folder'?
                                                                        t('folder'): item[field.dataName]}
                                                                    </Typography>
                                                                </Stack>
                                                            )
                                                        }
                                                        <IconButton size="small" onClick={handleClickMoreIcon} sx={{ width: "40px" }}>
                                                            <MoreVertIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
                                                )
                                            }
                                        </Box>
                                    </Stack>
                    }
                    {open && <CommonMenu itemId={selectedId} itemName={selectedName} itemType={selectedFileType}
                        data={thisMenuData} open={open} anchorel={anchorEl} setanchorel={setAnchorEl} />}
                    {pathListOpen &&
                        <Menu
                            id="basic-menu"
                            anchorEl={pathListAnchorEl}
                            open={pathListOpen}
                            onClose={handleClosePathList}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {
                                collapsedPath.map(item =>
                                    <MenuItem key={item.id}
                                        onClick={() => handleClickPathListItem(item.id)}
                                    >
                                        {item.name}
                                    </MenuItem>
                                )
                            }
                        </Menu>
                    }
                </Box>
                <ItemDetailCard key={itemDetailCardKey}
                    detailCardData={detailCardData} />
            </Box>
        </>
    )
}