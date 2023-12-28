'use client'
import * as React from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CommonTreeView from '@/app/components/commonTreeView/commonTreeView';
import { useEffect } from 'react';
import api from '@/api';
let { reqFolder, reqLogin, reqNewFolder, reqGetFolderStructure, reqLogout } = api;
import { useDispatch, useSelector } from 'react-redux';
import { fetchFolderStructor, setFolderStructor } from '@/app/store/modules/folderStore';
import { setFolderSelectValue } from '@/app/store/modules/folderSelectStore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CommonMenu from '@/app/components/commonMenu/commonMenu';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { checkFolderExist } from '@/utils/folderTreeUtils';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import { headers } from '@/next.config';
import _ from 'lodash';
import FolderIcon from '@mui/icons-material/Folder';
import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';
import { updateFolderStructor, updateFolderStructorAndFolderSelect } from '@/utils/updateStoreFunctions';
import ErrorIcon from '@mui/icons-material/Error';
import { setLoginStatus } from '@/app/store/modules/loginStore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Icons from '@/app/components/icon/icon';
import { processActionResponse, processResponse } from '@/utils/processResponseUtils';
import AddIcon from '@mui/icons-material/Add';
import { Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BACK_END_URL } from '@/config/config';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const LINKS = [
    { text: 'Trash', href: '/trash', icon: DeleteIcon },
    { text: 'Storage', href: '/storage', icon: StarIcon },
];


function ResponsiveAppBar({ children }) {
    const dispatch = useDispatch();
    const { folderStructor } = useSelector(state => state.folder);
    const { folderSelectValue } = useSelector(state => state.folderSelect);
    const { loginStatus, userName } = useSelector(state => state.login);
    const router = useRouter()
    const inputRef = useRef(null);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElNew, setAnchorElNew] = React.useState(null);
    const [folderNameDialogOpen, setFolderNameDialogOpen] = React.useState(false);
    const [newFolderName, setNewFolderName] = React.useState('Untitled folder');
    const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
    const { alertMessage, alertType, alertOpen } = alertState
    const [uploadingFiles, setUploadingFiles] = React.useState([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [showUploading, setShowUploading] = React.useState(false)
    const [showUploadingDetails, setShowUploadingDetails] = React.useState(true)
    const [showUploadingCloseButton, setShowUploadingCloseButton] = React.useState(false)

    console.log('渲染', isUploading, uploadingFiles)
    const pathname = usePathname()

    let nowUploadingIndex = 0
    uploadingFiles.forEach((item, index) => {
        if (item.status === 'uploaded') {
            nowUploadingIndex++
        }
    })



    const handleAlertClose = () => {
        setAlertState({ ...alertState, alertOpen: false })
    }
    const handleAlertOpen = (alertMessage, alertType) => {
        setAlertState({ alertMessage, alertType, alertOpen: true })
    }
    const userMenuData = [

        {
            name: 'Settings',
            icon: <SettingsIcon />,
            action: () => {


            },
        },
        {
            name: 'Logout',
            icon: <LogoutIcon />,
            action: async () => {
                let res = await reqLogout()
                processResponse(res, dispatch, handleAlertOpen)
                dispatch(setLoginStatus(-1))
            },
        },
    ]

    const menuData = [
        [
            {
                name: 'New folder',
                icon: <CreateNewFolderIcon />,
                action: (id) => {
                    console.log(`menu${id}`)
                    let isExist = checkFolderExist(folderStructor, folderSelectValue)
                    if (!isExist) {
                        handleAlertOpen('请选择文件夹', 'warning')
                        return
                    }
                    handleClickOpenfolderNameDialog()
                },
            },
        ],
        [
            {
                name: 'File upload',
                icon: <UploadFileIcon />,
                action: (id) => {
                    console.log(`menu${id}`)
                    let isExist = checkFolderExist(folderStructor, folderSelectValue)
                    if (!isExist) {
                        handleAlertOpen('请选择文件夹', 'warning')
                        return
                    }
                    if (!isUploading) {
                        inputRef.current.click()
                    }
                    else {
                        handleAlertOpen('已有上传任务', 'warning')
                    }
                },
            },
        ],
    ]

    const upLoadFileAxios = async (formData, index, parseUploadingFiles) => {
        return axios.post(BACK_END_URL + `/files?folder-id=${folderSelectValue}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
                //let progresss = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                console.log(progressEvent.loaded)
                // let newUploadingFiles = [ ... parseUploadingFiles]
                // newUploadingFiles[index].loaded = progressEvent.loaded
                let newUploadingFiles = parseUploadingFiles.map((item, i) => {
                    if (i !== index) {
                        return item
                    }
                    return {
                        name: item.name,
                        fileType: item.fileType,
                        loaded: progressEvent.loaded,
                        total: item.total,
                        status: item.status,
                    }
                })
                setUploadingFiles(newUploadingFiles)
            },
        })
    }
    const handleFileUpload = async (e) => {
        let isExist = checkFolderExist(folderStructor, folderSelectValue)
        if (!isExist) {
            handleAlertOpen('请选择文件夹', 'warning')
            inputRef.current.value = ''
            return
        }
        setIsUploading(true)
        const files = e.target.files
        let thisUpLoadingFiles = []
        for (let index = 0; index < files.length; index++) {
            const item = files[index]
            let suffix = ''
            if (item.name.lastIndexOf('.') !== -1) {
                suffix = item.name.substring(item.name.lastIndexOf('.') + 1)
            }
            thisUpLoadingFiles.push({
                name: item.name,
                fileType: suffix,
                loaded: 0,
                total: item.size,
                status: 'wait',
            })
        }
        setUploadingFiles(thisUpLoadingFiles)
        setShowUploading(true)
        let hasFolderNotExistError = false
        for (let index = 0; index < files.length; index++) {
            let thisIndex = index
            const item = files[index]
            const formData = new FormData();
            formData.append('file', item);
            thisUpLoadingFiles[index].status = 'uploading'
            if (index > 0) {
                thisUpLoadingFiles[index].loaded = thisUpLoadingFiles[index].total
            }
            try {
                let res = await upLoadFileAxios(formData, thisIndex, thisUpLoadingFiles)
                console.log(res)
                thisUpLoadingFiles = _.cloneDeep(thisUpLoadingFiles)
                if (res.data?.code === 200) {
                    thisUpLoadingFiles[index].status = 'uploaded'
                    updateFolderStructor(dispatch, handleAlertOpen)
                }
                else if (res.data?.code === 450) {
                    thisUpLoadingFiles[index].status = 'fail'
                    handleAlertOpen('文件夹不存在', 'error')
                    hasFolderNotExistError = true
                }
            } catch (err) {
                console.log(`${item.name}上传错误`)
                thisUpLoadingFiles = _.cloneDeep(thisUpLoadingFiles)
                thisUpLoadingFiles[index].status = 'fail'
                setUploadingFiles(thisUpLoadingFiles)
                handleAlertOpen('网络故障', 'error')
            }
        }
        inputRef.current.value = ''
        if (hasFolderNotExistError) {
            updateFolderStructorAndFolderSelect(dispatch, handleAlertOpen)
        }

        console.log('最终列表', thisUpLoadingFiles)
        setUploadingFiles(thisUpLoadingFiles)
        setShowUploadingCloseButton(true)
        setIsUploading(false)
    }


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const newMenuOpen = Boolean(anchorElNew);
    const handleClickNewMenu = (event) => {
        setAnchorElNew(event.currentTarget);
    };
    const handleCloseNewMenu = () => {
        setAnchorElNew(null);
    };

    const handleClickOpenfolderNameDialog = () => {
        setFolderNameDialogOpen(true);
        setAnchorElNew(null);
    };

    const handleClosefolderNameDialog = () => {
        setFolderNameDialogOpen(false);
    };

    const handleInputChangeNewFolderName = (e) => {
        setNewFolderName(e.target.value)
    }
    const handleClickCreateNewFolder = async () => {
        let res = await reqNewFolder(newFolderName, folderSelectValue)
        console.log(res)
        processActionResponse(res, dispatch, handleAlertOpen, {
            200: { message: '创建文件夹成功', action: 1 },
            409: { message: `文件夹重名: ${res.message}`, action: 1 },
            450: { message: `文件夹不存在: ${res.message}`, action: 2 }
        })
        setFolderNameDialogOpen(false);
    }

    const handleClickDrawerItem = () => {
        dispatch(setFolderSelectValue(null))
    }

    const handleClickUserMenu = (action) => {
        action()
    }

    const handleClickShowUploadingDetails = () => {
        setShowUploadingDetails(!showUploadingDetails)
    }

    const handleClickUploadingCloseButton = () => {
        setShowUploadingCloseButton(false)
        setShowUploading(false)
    }

    const handleClickRefresh = ()=>{
        updateFolderStructorAndFolderSelect(dispatch, handleAlertOpen)
        router.replace('/my-drive')
    }

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //width: '50%'
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        //width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 1),
            // vertical padding + font size from searchIcon
            //paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
        },
        flexGrow: 1
    }));


    const actionAfterLogin = async () => {
        let res = await reqGetFolderStructure()
        processResponse(res, dispatch, handleAlertOpen)
        let folderStructor = res.data.rootFolderNode
        folderStructor.name = "My Drive"
        dispatch(setFolderStructor(folderStructor))
        if (pathname === '/my-drive') {
            dispatch(setFolderSelectValue(folderStructor.id))
        }
    }

    useEffect(() => {
        if (loginStatus === -1) {
            router.push('/log-in')
        }
        else if (loginStatus === 1) {
            actionAfterLogin()
        }
    }, [loginStatus]);

    return (
        <>
            <AppBar sx={{
                height: '64px', position: "fixed", top: "0", bgcolor: 'background.default', color: 'text.secondary',
                boxShadow: 0,
            }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: '64px', }}>
                        <Box sx={{
                            width: '238px'
                        }}>
                            <AdbIcon sx={{ display: 'flex', mr: 1 }} />
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{
                                position: 'relative',
                                borderRadius: 1,
                                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                                },
                                marginLeft: 0,
                                //flexGrow: 1,
                                width: '80%',
                                display: "flex"
                            }}>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(a) => console.log(a)}
                                />
                                {/* <SearchIconWrapper sx={{right: 0, top: 0}}>
                                <SearchIcon />
                            </SearchIconWrapper> */}
                                <IconButton >
                                    <CloseIcon />
                                </IconButton>
                                <IconButton >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>

                        </Box>


                        <Box >
                            <Tooltip title={
                                <React.Fragment>
                                    <Typography color="inherit">Account</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'grey.400', fontWeight: '500' }}>{userName}</Typography>
                                </React.Fragment>
                            }>
                                {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton> */}
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenUserMenu}
                                    color="inherit"
                                >
                                    <AccountCircle fontSize='large'/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {userMenuData.map((item, index) => (
                                    <MenuItem key={index} onClick={() => handleClickUserMenu(item.action)}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <Typography textAlign="center">{item.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        top: '64px',
                        height: 'auto',
                        bottom: 0,
                        padding: "8px",
                        bgcolor: 'background.default',
                        color: 'text.secondary',
                        border: 0,
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box sx={{ display: 'flex', mb: '8px' }}>
                    <Button startIcon={<AddIcon />}
                        onClick={handleClickNewMenu}
                        sx={{
                            bgcolor: 'white', '&:hover': { backgroundColor: '#edf2fa' },
                            width: '100px', height: '56px', boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.5)',
                            borderRadius: '10px', color: 'text.primary'
                        }}
                    >new</Button>
                    <Tooltip title='Refresh' disableInteractive placement='right-start'>
                    <IconButton 
                        onClick={handleClickRefresh}
                        sx={{
                            ml: '40px',
                            bgcolor: 'white', '&:hover': { backgroundColor: '#edf2fa' },
                            width: '56px', height: '56px', boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.5)',
                            borderRadius: '10px', color: 'text.primary'
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                    </Tooltip>
                    <input type="file" multiple ref={inputRef} onChange={handleFileUpload} style={{ visibility: 'hidden', width: '0px' }} />
                </Box>
                {/* component={Link} href={"/my-drive"} */}
                <List>
                    <ListItem>
                        <Box sx={{ textDecoration: "none" }}>
                            <CommonTreeView ></CommonTreeView>
                        </Box>
                    </ListItem>
                    {LINKS.map(({ text, href, icon: Icon }) => (
                        <ListItem key={href} disablePadding
                            onClick={handleClickDrawerItem}
                            sx={{ height: "32px" }}
                        >
                            <ListItemButton component={Link} href={href} selected={pathname === `/${text.toLowerCase()}`}
                                sx={{ height: "32px" }}>
                                <ListItemIcon sx={{minWidth: 0, ml:'22px'}}>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ typography: 'body1', pl: '16px' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {newMenuOpen && <CommonMenu itemId={folderSelectValue} data={menuData} open={newMenuOpen} anchorel={anchorElNew} setanchorel={setAnchorElNew} />}
            </Drawer>
            <Box
                component="main"
                sx={{
                    //flexGrow: 1,
                    //display: "flex",
                    //flexDirection: "column",
                    bgcolor: 'backgroud.default',
                    ml: '240px',
                    mt: '64px',
                    height: `calc(100vh - 64px)`,
                    p: 3,
                }}
            >
                {children}
            </Box>
            <Dialog open={folderNameDialogOpen} onClose={handleClosefolderNameDialog}>
                <DialogTitle>New folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        value={newFolderName}
                        onChange={handleInputChangeNewFolderName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosefolderNameDialog}>Cancel</Button>
                    <Button onClick={handleClickCreateNewFolder}>Create</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                open={alertOpen}
                onClose={handleAlertClose}
            >
                <Alert severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            {
                showUploading &&
                <Paper elevation={4} sx={{
                    position: 'fixed', bottom: 0, right: '16px',
                    width: '360px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px',
                    //boxShadow: '0px 0px 1px 0px rgba(0,0,0,1)'

                }}>
                    <Stack direction="row" spacing={1}
                        sx={{
                            height: '53px',
                            justifyContent: 'space-between',
                            alignItems: "center", pl: '16px', pr: '8px',
                            bgcolor: 'background.default',
                            borderTopRightRadius: '8px', borderTopLeftRadius: '8px',
                        }}
                    >
                        <Typography variant="subtitle1" >
                            {`${nowUploadingIndex} uplaods complete`}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton onClick={handleClickShowUploadingDetails}>
                                {
                                    showUploadingDetails ?
                                        <KeyboardArrowDownIcon /> :
                                        <KeyboardArrowUpIcon />
                                }
                            </IconButton>
                            {
                                showUploadingCloseButton ?
                                    <IconButton onClick={handleClickUploadingCloseButton}>
                                        <CloseIcon />
                                    </IconButton> :
                                    <Box sx={{ width: '40px', height: '40px' }}></Box>
                            }
                        </Stack>
                    </Stack>
                    {
                        showUploadingDetails &&
                        <Box sx={{ maxHeight: '150px', pl: '8px', pr: '8px', background: 'white', overflow: 'auto' }}>
                            {
                                uploadingFiles.map((item, index) =>
                                    <Stack direction="row" spacing={1} key={index}
                                        sx={{
                                            height: "40px",
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", width: '290px', overflow: 'hidden' }}>
                                            <Box sx={{ display: "flex", alignItems: "center", pl: "8px" }}>
                                                <Icons type={item.fileType} />
                                            </Box>
                                            <Tooltip title={item.name} disableInteractive>
                                                <Typography variant="body2" noWrap >
                                                    {item.name}
                                                </Typography>
                                            </Tooltip>
                                        </Stack>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", pl: "8px" }}>
                                                {
                                                    item.status === 'wait' &&
                                                    <CircularProgress size={25} color='grey' />
                                                }
                                                {
                                                    item.status === 'uploading' &&
                                                    <CircularProgress size={25} variant="determinate"
                                                        value={Math.round(item.loaded * 100 / item.total)}
                                                    />
                                                }
                                                {//
                                                    item.status === 'uploaded' &&
                                                    <Avatar sx={{ bgcolor: 'success.main', width: 23, height: 23 }}>
                                                        <DoneIcon fontSize="small" />
                                                    </Avatar>
                                                }
                                                {//
                                                    item.status === 'fail' &&
                                                    <Avatar sx={{ bgcolor: 'error.main', width: 23, height: 23 }}>
                                                        <ErrorIcon fontSize="small" />
                                                    </Avatar>

                                                }
                                            </Box>
                                        </Stack>
                                    </Stack>
                                )
                            }
                        </Box>
                    }

                </Paper>
            }

        </>
    );
}
export default ResponsiveAppBar;