'use client'
import React from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText,
    Tooltip
} from '@mui/material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import api from '@/api';
let { reqLogout } = api;
import { setLoginStatus } from '@/store/modules/loginStore';
import { processResponse } from '@/utils/processResponseUtils';
import { newDesUrl } from '@/utils/urlFunctions';


const drawerWidth = 240;

const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter()
    const pathname = usePathname()
    const { loginStatus, userName } = useSelector(state => state.login);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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
                processResponse(res, dispatch)
                dispatch(setLoginStatus(-1))
            },
        },
    ]


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleClickUserMenu = (action) => {
        action()
    }



    useEffect(() => {
        if (loginStatus === -1) {
            router.push(newDesUrl(pathname, '/log-in'))
        }
        else if (loginStatus === 1) {
            router.replace(newDesUrl(pathname, '/my-drive'))
        }

    }, [loginStatus]);

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            {/* Navigation Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: '240px',
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {['Users', 'Dashboard'].map((text, index) => (
                            <ListItem  key={text} component={Link} href={`/${text.toLowerCase()}`}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    display: 'flex', flexDirection: 'column', flexGrow: 1,
                    minHeight: '100vh', bgcolor: 'background.default', p: 3,
                    minWidth: '0px'
                }}
            >
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '64px' }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Admin Panel
                        </Typography>
                        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
                        </Box>
                        <Box sx={{ width: '238px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title={
                                <React.Fragment>
                                    <Typography color="inherit">Account</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'grey.400', fontWeight: '500' }}>{userName}</Typography>
                                </React.Fragment>
                            }>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenUserMenu}
                                    color="inherit"
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
                </AppBar>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;