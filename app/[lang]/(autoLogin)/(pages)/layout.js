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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
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
import CommonTreeView from '@/components/commonTreeView/commonTreeView';
import { useEffect } from 'react';
import api from '@/api';
let { reqFolder, reqLogin, reqNewFolder, reqGetFolderStructure, reqLogout } = api;
import { useDispatch, useSelector } from 'react-redux';
import { fetchFolderStructor, setFolderStructor } from '@/store/modules/folderStore';
import { setFolderSelectValue } from '@/store/modules/folderSelectStore';
import { setFolderExpandValue } from '@/store/modules/folderExpandStore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CommonMenu from '@/components/commonMenu/commonMenu';
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
import _ from 'lodash';
import FolderIcon from '@mui/icons-material/Folder';
import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';
import { updateFolderStructor, updateFolderStructorAndFolderSelect } from '@/utils/updateStoreFunctions';
import ErrorIcon from '@mui/icons-material/Error';
import { setLoginStatus } from '@/store/modules/loginStore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Icons from '@/components/icon/icon';
import { processActionResponse, processResponse } from '@/utils/processResponseUtils';
import AddIcon from '@mui/icons-material/Add';
import { Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BACK_END_URL, FILE_SIZE, FILE_SIZE_BYTE, siteMarkUrl } from '@/config/config';
import MySearchBar from '@/components/searchBar/searchBar';
import AddToDriveTwoToneIcon from '@mui/icons-material/AddToDriveTwoTone';
import { useTranslation } from '@/international/myTranslate';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { newLanguageUrl, urlWithoutLanguage, newDesUrl } from '@/utils/urlFunctions';
import { setAlertStatus } from '@/store/modules/alertStore';
import Image from 'next/image';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const LINKS = [
    { text: 'Trash', href: '/trash', icon: DeleteOutlineIcon, selectedIcon: DeleteIcon },
    { text: 'Storage', href: '/storage', icon: CloudOutlinedIcon, selectedIcon: CloudIcon },
];

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 13,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

function ResponsiveAppBar({ children }) {
    const dispatch = useDispatch();
    const { folderStructor } = useSelector(state => state.folder);
    const { folderSelectValue } = useSelector(state => state.folderSelect);
    const { loginStatus, userName } = useSelector(state => state.login);
    const { alertStatus } = useSelector(state => state.alert)
    const router = useRouter()
    const inputRef = useRef(null);
    const { t, lang } = useTranslation()
    const newFolderInputRef = useRef(null);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElNew, setAnchorElNew] = React.useState(null);
    const [folderNameDialogOpen, setFolderNameDialogOpen] = React.useState(false);
    const [newFolderName, setNewFolderName] = React.useState(t('Untitled folder'));
    //const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
    //const { alertMessage, alertType, alertOpen } = alertState
    const [uploadingFiles, setUploadingFiles] = React.useState([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [showUploading, setShowUploading] = React.useState(false)
    const [showUploadingDetails, setShowUploadingDetails] = React.useState(true)
    const [showUploadingCloseButton, setShowUploadingCloseButton] = React.useState(false)

    // console.log('渲染', isUploading, uploadingFiles, loginStatus)
    console.log(t('title'))
    const pathnameWithLang = usePathname()
    const pathname = urlWithoutLanguage(pathnameWithLang)

    let nowUploadingIndex = 0
    uploadingFiles.forEach((item, index) => {
        if (item.status === 'uploaded') {
            nowUploadingIndex++
        }
    })



    // const handleAlertClose = () => {
    //     setAlertState({ ...alertState, alertOpen: false })
    // }
    // const handleAlertOpen = (alertMessage, alertType) => {
    //     setAlertState({ alertMessage, alertType, alertOpen: true })
    // }
    const userMenuData = [

        {
            name: t('Settings'),
            icon: <SettingsIcon />,
            action: () => {


            },
        },
        {
            name: t('Logout'),
            icon: <LogoutIcon />,
            action: async () => {
                let res = await reqLogout()
                processResponse(res, dispatch)
                dispatch(setLoginStatus(-1))
                dispatch(setFolderStructor({ id: 0, name: "My Drive", children: [] }))
                dispatch(setFolderSelectValue(null))
                dispatch(setFolderExpandValue([]))
            },
        },
    ]

    const menuData = [
        [
            {
                name: 'New folder',
                icon: <CreateNewFolderIcon />,
                action: (id) => {
                    // console.log(`menu${id}`)
                    let isExist = checkFolderExist(folderStructor, folderSelectValue)
                    if (pathname !== '/my-drive' || !isExist) {
                        dispatch(setAlertStatus({ open: true, alertType: 'warning', message: t('Please select a folder') }))
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
                    // console.log(`menu${id}`)
                    let isExist = checkFolderExist(folderStructor, folderSelectValue)
                    if (pathname !== '/my-drive' || !isExist) {
                        dispatch(setAlertStatus({ open: true, alertType: 'warning', message: t('Please select a folder') }))
                        return
                    }
                    if (!isUploading) {
                        inputRef.current.click()
                    }
                    else {
                        dispatch(setAlertStatus({ open: true, alertType: 'warning', message: t('There are files being uploaded') }))
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
                // console.log(progressEvent.loaded)
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
            dispatch(setAlertStatus({ open: true, alertType: 'warning', message: t('Please select a folder') }))
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
                let res = null
                //console.log(item.size)
                if (item.size > FILE_SIZE_BYTE) {
                    res = {
                        data: { code: 403 }
                    }
                }
                else {
                    res = await upLoadFileAxios(formData, thisIndex, thisUpLoadingFiles)
                }

                // console.log(res)
                thisUpLoadingFiles = _.cloneDeep(thisUpLoadingFiles)
                if (res.data?.code === 200) {
                    thisUpLoadingFiles[index].status = 'uploaded'
                    updateFolderStructor(dispatch)
                }
                else if (res.data?.code === 450) {
                    thisUpLoadingFiles[index].status = 'fail'
                    dispatch(setAlertStatus({ open: true, alertType: 'error', message: t('The target folder does not exist') }))
                    hasFolderNotExistError = true
                }
                else if (res.data?.code === 403) {
                    thisUpLoadingFiles[index].status = 'fail'
                    //+++++
                    dispatch(setAlertStatus({
                        open: true, alertType: 'error', message: lang === "en" ?
                            `File is too large, do not exceed ${FILE_SIZE}MB.` :
                            `ファイルが大きすぎます。${FILE_SIZE}MBを超えないようにしてください。`
                    }))
                }
                else if (res.data?.code === 410) {
                    thisUpLoadingFiles[index].status = 'fail'
                    dispatch(setAlertStatus({ open: true, alertType: 'error', message: t('Too many requests, please try again later.') }))
                }
                else if (res.data?.code === 411) {
                    thisUpLoadingFiles[index].status = 'fail'
                    dispatch(setAlertStatus({ open: true, alertType: 'error', message: t('Storage full. Clear files to free up space.') }))
                }
                else if (res.data?.code === 429) {
                    thisUpLoadingFiles[index].status = 'fail'
                    dispatch(setAlertStatus({ open: true, alertType: 'error', message: t('The system is busy, please try again later.') }))
                }
                else if (res.data?.code === 503) {
                    thisUpLoadingFiles[index].status = 'fail'
                    dispatch(setAlertStatus({ open: true, alertType: 'error', message: t('Service unavailable') }))
                }
            } catch (err) {
                // console.log(`${item.name}上传错误`)
                thisUpLoadingFiles = _.cloneDeep(thisUpLoadingFiles)
                thisUpLoadingFiles[index].status = 'fail'
                setUploadingFiles(thisUpLoadingFiles)
                let errMassage = t("Network failure")
                if (err.response) {
                    errMassage = err.response.data.message
                }
                dispatch(setAlertStatus({ open: true, alertType: 'error', message: errMassage }))
            }
        }
        inputRef.current.value = ''
        if (hasFolderNotExistError) {
            updateFolderStructorAndFolderSelect(dispatch)
        }

        // console.log('最终列表', thisUpLoadingFiles)
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
        setTimeout(() => {
            newFolderInputRef.current.select()
        }, 0)
    };

    const handleClosefolderNameDialog = () => {
        setFolderNameDialogOpen(false);
        setNewFolderName(t('Untitled folder'));
    };

    const handleInputChangeNewFolderName = (e) => {
        setNewFolderName(e.target.value)
    }
    const handleClickCreateNewFolder = async () => {
        let res = await reqNewFolder(newFolderName, folderSelectValue)
        // console.log(res)
        processActionResponse(res, dispatch, {
            200: { message: t('Folder created successfully'), action: 1 },
            409: { message: t(`Folder naming conflict`), action: 1 },
            450: { message: t(`The target folder does not exist`), action: 2 }
        })
        setFolderNameDialogOpen(false);
        setNewFolderName(t('Untitled folder'));
    }

    const handleClickDrawerItem = () => {
        //dispatch(setFolderSelectValue(folderStructor.id))
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

    const handleClickRefresh = () => {
        updateFolderStructorAndFolderSelect(dispatch)
        router.replace(newDesUrl(pathnameWithLang, '/my-drive'))
    }

    const switchLanguage = (e) => {
        let newPathname = newLanguageUrl(pathname, e.target.value)
        router.push(newPathname)
    };

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

    const handleAlertClose = () => {
        dispatch(setAlertStatus({ ...alertStatus, open: false }))
    }


    const actionAfterLogin = async () => {
        let res = await reqGetFolderStructure()
        processResponse(res, dispatch)
        let folderStructor = res.data.rootFolderNode
        folderStructor.name = t("My Drive")
        dispatch(setFolderStructor(folderStructor))
        dispatch(setFolderSelectValue(folderStructor.id))
    }

    useEffect(() => {
        if (loginStatus === -1) {
            // console.log(111111)
            router.push(newDesUrl(pathnameWithLang, '/log-in'))
        }
        else if (loginStatus === 2) {
            router.replace(newDesUrl(pathnameWithLang, '/users'))
        }
        else if (loginStatus === 1 && folderStructor.id === 0) {
            actionAfterLogin()
        }
        if (pathname !== '/my-drive' && folderStructor.id !== 0) {
            dispatch(setFolderSelectValue(folderStructor.id))
        }
    }, [loginStatus, pathname]);

    return (
        <>
            <AppBar sx={{
                height: '64px', position: "fixed", top: "0", bgcolor: 'background.default', color: 'text.secondary',
                boxShadow: 0,
            }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: '64px', }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', pl: '20px', }}>
                            <Image
                                src={siteMarkUrl}
                                height={28}
                                width={48}
                                layout="intrinsic"
                                alt=""
                            />
                            <Typography fontFamily={'"Delius"'} fontSize='1.25em' fontWeight='500' variant="h5" sx={{ ml: '6px' }}>Drive</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
                            <MySearchBar />
                        </Box>

                        <Box sx={{ width: '238px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <FormControl sx={{ mr: 3 }} variant="standard">
                                <Select
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={lang}
                                    onChange={switchLanguage}
                                    input={<BootstrapInput />}
                                    sx={{ width: '90px' }}
                                >
                                    <MenuItem value={"ja"} sx={{ fontSize: 13 }}>{t('japanese')}</MenuItem>
                                    <MenuItem value={"en"} sx={{ fontSize: 13 }}>{t('english')}</MenuItem>
                                </Select>
                            </FormControl>
                            <Tooltip title={
                                <React.Fragment>
                                    <Typography color="inherit">{t('Account')}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'grey.400', fontWeight: '500' }}>{userName}</Typography>
                                </React.Fragment>
                            }>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenUserMenu}
                                    color="login"
                                >
                                    <AccountCircle fontSize='large' />
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
                <Box sx={{ display: 'flex', mb: '8px', ml: '12px' }}>
                    <Button startIcon={<AddIcon />}
                        onClick={handleClickNewMenu}
                        sx={{
                            bgcolor: 'white', '&:hover': { backgroundColor: '#edf2fa' },
                            width: '100px', height: '56px', boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.5)',
                            borderRadius: '10px', color: 'text.primary'
                        }}
                    >{t('new')}</Button>
                    <Tooltip title={t('Refresh')} disableInteractive placement='right-start'>
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
                    <ListItem sx={{ mb: '4px' }}>
                        <Box sx={{ textDecoration: "none" }}>
                            <CommonTreeView ></CommonTreeView>
                        </Box>
                    </ListItem>
                    {LINKS.map(({ text, href, icon: Icon, selectedIcon: SelectedIcon }) => (
                        <ListItem key={href} disablePadding
                            onClick={handleClickDrawerItem}
                            sx={{ height: "32px", mb: '8px' }}
                        >
                            <ListItemButton component={Link} href={newDesUrl(pathnameWithLang, href)}
                                selected={pathname === `/${text.toLowerCase()}`}
                                disableTouchRipple={true} sx={{ height: "32px", borderRadius: '15px' }}>
                                <ListItemIcon sx={{ minWidth: 0, ml: '22px' }}>
                                    {
                                        pathname === `/${text.toLowerCase()}` ?
                                            <SelectedIcon /> :
                                            <Icon />
                                    }
                                </ListItemIcon>
                                <ListItemText primary={t(text)} sx={{ typography: 'body1', pl: '16px' }} />
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
                <DialogTitle>{t('New folder')}</DialogTitle>
                <DialogContent sx={{ width: '350px' }}>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={newFolderName}
                        onChange={handleInputChangeNewFolderName}
                        inputRef={newFolderInputRef}
                    />
                </DialogContent>
                <DialogActions sx={{ mr: '16px', mb: '8px' }}>
                    <Button onClick={handleClosefolderNameDialog} size='small'
                        sx={{ borderRadius: '16px', }}
                    >{t('Cancel')}</Button>
                    <Button onClick={handleClickCreateNewFolder} size='small' variant='contained'
                        sx={{ borderRadius: '16px', }}
                    >{t('OK')}</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                open={alertStatus.open}
                onClose={handleAlertClose}
            >
                <Alert severity={alertStatus.alertType} sx={{ width: '100%' }}>
                    {alertStatus.message}
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
                            {lang === "en" ? `${nowUploadingIndex} uplaods complete` :
                                `${nowUploadingIndex}件のアプロードが完了しました`}
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
                                                <Icons type={item.fileType.toLowerCase()} />
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