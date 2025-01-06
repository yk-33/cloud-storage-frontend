import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { Stack } from '@mui/material';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import api from '@/api'
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus, setUserName } from '@/store/modules/loginStore';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { newDesUrl } from '@/utils/urlFunctions';
const { reqLogin } = api
import { useTranslation } from '@/international/myTranslate';
import { siteMarkUrl } from '@/config/config';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const dispatch = useDispatch();
  const { t, lang } = useTranslation()
  const { loginStatus } = useSelector(state => state.login);
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState(searchParams.get('username'))
  const [password, setPassword] = useState('')
  const [alertState, setAlertState] = React.useState({ alertMessage: '123', alertType: 'error', alertOpen: false, });
  const { alertMessage, alertType, alertOpen } = alertState
  const [usernameEmpty, setUsernameEmpty] = useState(false)
  const [passwordEmpty, setPasswordEmpty] = useState(false)
  const [loginError, setLoginError] = useState(false)

  const handleAlertClose = () => {
    setAlertState({ ...alertState, alertOpen: false })
  }
  const handleAlertOpen = (alertMessage, alertType) => {
    setAlertState({ alertMessage, alertType, alertOpen: true })
  }

  const handleOnChangeUsername = (e) => {
    setUsername(e.target.value)
    if (e.target.value === '') {
      setUsernameEmpty(true)
    }
    else {
      setUsernameEmpty(false)
    }
  }

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value)
    if (e.target.value === '') {
      setPasswordEmpty(true)
    }
    else {
      setPasswordEmpty(false)
    }
  }

  const handleSubmit = async (event) => {
    let notSubmit = false
    if (username === '' || username === null) {
      notSubmit = true
      setUsernameEmpty(true)
    }
    if (password === '') {
      notSubmit = true
      setPasswordEmpty(true)
    }
    if (notSubmit) {
      return
    }
    let res = await reqLogin(username, password)
    if (res.code === 200) {
      if (res.data.isSuperAdmin) {
        dispatch(setLoginStatus(2))
      }
      else {
        dispatch(setLoginStatus(1))
      }
      dispatch(setUserName(res.data.username))
    }
    else if (res.code === 429) {
      handleAlertOpen(t('The system is busy, please try again later.'), 'error')
    }
    else if (res.code === 503) {
      handleAlertOpen(t('Network failure'), 'info')
    }
    else {
      handleAlertOpen(t('Incorrect username or password'), 'error')
      setLoginError(true)
    }
    // else {
    //   dispatch(setLoginStatus(-1))
    // }
  };

  useEffect(() => {
    if (loginStatus === 1) {
      router.replace(newDesUrl(pathname, '/my-drive'))
    }
    else if (loginStatus === 2) {
      router.replace(newDesUrl(pathname, '/users'))
    }
  }, [loginStatus])

  let usernameHelperText = ' '
  if (usernameEmpty) {
    usernameHelperText = t('Username is empty')
  }

  let passwordHelperText = ' '
  if (passwordEmpty) {
    passwordHelperText = t('Password is empty')
  }

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'flex-end' }}>
        <Box>
        <Image
          src={siteMarkUrl}
          height={32}
          width={52}
          layout="intrinsic"
          alt=""
        />
        </Box>
        <Typography fontFamily={'"Delius"'} variant="h5" sx={{ ml: '6px', mb: '3px' }}>Drive</Typography>
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        {t('Sign in')}
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}
      >
        <Stack>
          <FormLabel >{t('Username')}</FormLabel>
          <TextField
            required
            fullWidth
            placeholder={t("Username")}
            autoFocus
            value={username === null ? '' : username}
            onChange={handleOnChangeUsername}
            error={usernameEmpty}
            helperText={usernameHelperText}
          />
        </Stack>
        <Stack>
          <FormLabel htmlFor="password">{t('Password')}</FormLabel>
          <TextField
            required
            fullWidth
            type="password"
            placeholder="••••••"
            value={password}
            onChange={handleOnChangePassword}
            error={passwordEmpty}
            helperText={passwordHelperText}
            color={loginError ? 'error' : 'primary'}
          />
        </Stack>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label={t("Remember me")}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 1 }}
          onClick={handleSubmit}
        >
          {t('Sign In')}
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          {t("Don't have an account? ")}
          <span>
            <Link
              href={newDesUrl(pathname, "/sign-up")}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              {t('Sign up')}
            </Link>
          </span>
        </Typography>
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
    </Card>
  );
}
