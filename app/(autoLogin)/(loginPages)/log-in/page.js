'use client'
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '@/api'
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus, setUserName } from '@/store/modules/loginStore';
import { useRouter, useSearchParams } from 'next/navigation'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const { reqLogin } = api

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://web.simple-cloud-storage.click/">
        web.simple-cloud-storage.click
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const { loginStatus } = useSelector(state => state.login);
  const router = useRouter()
  const searchParams = useSearchParams()

  const [username, setUsername] = useState(searchParams.get('username'))
  const [password, setPassword] = useState('')
  const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
  const { alertMessage, alertType, alertOpen } = alertState

  const handleAlertClose = () => {
    setAlertState({ ...alertState, alertOpen: false })
  }
  const handleAlertOpen = (alertMessage, alertType) => {
    setAlertState({ alertMessage, alertType, alertOpen: true })
  }

  const handleOnChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (event) => {
    let res = await reqLogin(username, password)
    if (res.code === 200) {
      dispatch(setLoginStatus(1))
      dispatch(setUserName(res.data.userName))
    }
    else if (res.code === 503) {
      handleAlertOpen('Network failure', 'error')
    }
    else {
      handleAlertOpen('Incorrect username or password', 'error')
    }
    // else {
    //   dispatch(setLoginStatus(-1))
    // }
  };

  useEffect(() => {
    if (loginStatus === 1) {
      router.replace('/my-drive')
    }
  }, [loginStatus])
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" align='right'>
          Sign in
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Username"
                autoFocus
                value={username}
                onChange={handleOnChangeUsername}
                helperText=" "
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleOnChangePassword}
                helperText=" "
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
      <Box sx={{ position: 'absolute', right: '24px', bottom: '24px', width: '350px', maxWidth: 'calc(50% - 224px)',
      padding: '16px',
        background: 'white', boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.5)', borderRadius: '10px'
     }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '8px' }}>
          <Typography variant="h5" component="h2">
            注意
          </Typography>
        </Box>
        <Box sx={{maxHeight: '380px'}}>
          <Typography variant="body2" component="h2" sx={{mb: '4px'}}>
            • 安全のために、日常で使用されているパスワードは使用しないでください。プライバシーファイルをアップロードしないでください。
          </Typography>
          <Typography variant="body2" component="h2">
            • サーバのパフォーマンスには限界があり、最大アップロード可能なファイルサイズは2MBに設定されています。
          </Typography>
        </Box>
      </Box>
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
    </Container>
  );
}