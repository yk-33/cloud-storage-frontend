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
import { setLoginStatus } from '@/store/modules/loginStore';
import { useRouter } from 'next/navigation'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const { reqRegisterUser, reqCheckUsernameUnique } = api


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

export default function SignUp() {
  const dispatch = useDispatch();
  const { loginStatus } = useSelector(state => state.login);
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameExists, setrUsernameExists] = useState(false)
  const [usernameEmpty, setUsernameEmpty] = useState(false)
  const [passwordEmpty, setPasswordEmpty] = useState(false)
  const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
  const { alertMessage, alertType, alertOpen } = alertState
  const [alertState2, setAlertState2] = React.useState({ alertMessage2: '123', alertType2: 'info', alertOpen2: false, });
  const { alertMessage2, alertType2, alertOpen2 } = alertState2

  let timer, timerAlert;

  const handleAlertClose = () => {
    setAlertState({ ...alertState, alertOpen: false })
  }
  const handleAlertOpen = (alertMessage, alertType) => {
    setAlertState({ alertMessage, alertType, alertOpen: true })
  }
  const handleAlertClose2 = () => {
    setAlertState2({ ...alertState2, alertOpen2: false })
  }
  const handleAlertOpen2 = (alertMessage2, alertType2) => {
    setAlertState2({ alertMessage2, alertType2, alertOpen2: true })
  }

  let usernameHelperText = ' '
  if (usernameExists) {
    usernameHelperText = 'Username already exits'
  }
  else if (usernameEmpty) {
    usernameHelperText = 'Username is empty'
  }

  let passwordHelperText = ' '
  if (passwordEmpty) {
    passwordHelperText = 'Password is empty'
  }

  const handleOnChangeUsername = async (e) => {
    let username = e.target.value
    setUsername(username)
    if (username === '') {
      setUsernameEmpty(true)
      setrUsernameExists(false)
      return
    }
    setUsernameEmpty(false)
    let res = await reqCheckUsernameUnique(username)
    // console.log(res)
    if (res.code === 200) {
      setrUsernameExists(false)
    }
    else if (res.code === 409) {
      setrUsernameExists(true)
    }
    else if (res.code === 503) {
      handleAlertOpen('Network failure', 'error')
    }
  }

  const handleOnChangePassword = (e) => {
    let password = e.target.value
    setPassword(password)
    if (password === '') {
      setPasswordEmpty(true)
    }
    else {
      setPasswordEmpty(false)
    }
  }

  const handleSubmit = async (event) => {
    let notSubmit = false
    if (username === '') {
      setUsernameEmpty(true)
      notSubmit = true
    }
    if (password === '') {
      setPasswordEmpty(true)
      notSubmit = true
    }
    if (usernameExists) {
      notSubmit = true
    }
    if (notSubmit) {
      return
    }

    let res = await reqRegisterUser(username, password)
    // console.log(res)
    if (res.code === 200) {
      timer = setTimeout(() => {
        router.push(`/log-in?username=${username}`)
      }, 3000)
      let seconds = 3
      timerAlert = setInterval(() => { 
        handleAlertOpen(`Register successfully!`, 'success')
        handleAlertOpen2(`Will redirect to login page in ${seconds} s.`, 'info')
        seconds--
      }, 1000)
    }
    else if (res.code === 409) {
      setrUsernameExists(true)
    }
    else {
      handleAlertOpen('Network failure', 'error')
    }
  };

  useEffect(() => {
    if (loginStatus === 1) {
      router.replace('/my-drive')
    }
    return () => {
      clearTimeout(timer)
      clearInterval(timerAlert)
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
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                autoFocus
                value={username}
                onChange={handleOnChangeUsername}
                error={usernameExists || usernameEmpty}
                helperText={usernameHelperText}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={handleOnChangePassword}
                error={passwordEmpty}
                helperText={passwordHelperText}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/log-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        open={alertOpen2}
        style={{top:'80px'}}
        onClose={handleAlertClose2}
      >
        <Alert severity={alertType2} sx={{ width: '100%' }}>
          {alertMessage2}
        </Alert>
      </Snackbar>
    </Container>
  );
}