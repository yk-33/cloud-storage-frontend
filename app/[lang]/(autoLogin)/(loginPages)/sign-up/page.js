'use client'
import React, { useEffect, useState } from 'react';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '@/components/shared-theme/AppTheme';
import { SitemarkIcon } from './CustomIcons';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import api from '@/api'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from '@/international/myTranslate';
import { Select } from 'antd';
import { newLanguageUrl, urlWithoutLanguage, newDesUrl } from '@/utils/urlFunctions';
import { siteMarkUrl } from '@/config/config';
import Image from 'next/image';
const { reqRegisterUser, reqCheckUsernameUnique } = api


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
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

const SignUpContainer = styled(Box)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  // padding: theme.spacing(2),
  // [theme.breakpoints.up('sm')]: {
  //   padding: theme.spacing(4),
  // },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const dispatch = useDispatch();
  const { t, lang } = useTranslation()
  const { loginStatus } = useSelector(state => state.login);
  const router = useRouter()
  const pathnameWithLang = usePathname()
  const pathname = urlWithoutLanguage(pathnameWithLang)
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

  const switchLanguage = (value) => {
    let newPathname = newLanguageUrl(pathname, value)
    router.push(newPathname)
  };

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
    usernameHelperText = t('Username already exits')
  }
  else if (usernameEmpty) {
    usernameHelperText = t('Username is empty')
  }

  let passwordHelperText = ' '
  if (passwordEmpty) {
    passwordHelperText = t('Password is empty')
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
      handleAlertOpen(t('Network failure'), 'error')
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

  const handleKeyDown = (e) => {
    if(e.key !== "Enter"){
      return
    }
    handleSubmit(e)
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
        router.push(newDesUrl(pathnameWithLang, `/log-in?username=${username}`))
      }, 5000)
      let seconds = 5
      timerAlert = setInterval(() => {
        handleAlertOpen(t(`Register successfully!`), 'success')
        handleAlertOpen2(lang == "en" ? `Will redirect to login page in ${seconds} s.` :
          `${seconds} 秒後にログインページへリダイレクトします。`, 'info')
        seconds--
      }, 1000)
    }
    else if (res.code === 409) {
      setrUsernameExists(true)
    }
    else if (res.code === 429) {
      handleAlertOpen(t('The system is busy, please try again later.'), 'error')
    }
    else {
      handleAlertOpen(t('Network failure'), 'error')
    }
  };

  useEffect(() => {
    if (loginStatus === 1) {
      router.replace(newDesUrl(pathnameWithLang, '/my-drive'))
    }
    else if (loginStatus === 2) {
      router.replace(newDesUrl(pathnameWithLang, '/users'))
    }
    return () => {
      clearTimeout(timer)
      clearInterval(timerAlert)
    }
  }, [loginStatus])


  return (
    <AppTheme {...props}>
      <SignUpContainer >
        <Stack
          direction={{ xs: 'column', md: 'row-reverse' }}
          sx={{
            height: '100%',
            justifyContent: 'center',
            gap: { xs: 6, sm: 0 },
            p: 2,
            mx: 2,
          }}
        >
          <Box sx={{ position: 'relative', height: '64px',
            pt: {sm: '5px', md: '5px', lg: '10px'}
           }}>
            <Select
              value={lang}
              style={{
                position: 'absolute',
                right: 0,
                width: '120px',
              }}
              onChange={switchLanguage}
              options={[
                {
                  value: 'ja',
                  label: t('japanese'),
                },
                {
                  value: 'en',
                  label: t('english'),
                },
              ]}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Card variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Box >
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
                {t('Sign up')}
              </Typography>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <Stack>
                  <FormLabel htmlFor="name">{t('Username')}</FormLabel>
                  <TextField
                    required
                    fullWidth
                    autoFocus
                    placeholder={t('Username')}
                    value={username}
                    onChange={handleOnChangeUsername}
                    error={usernameExists || usernameEmpty}
                    helperText={usernameHelperText}
                    onKeyDown={handleKeyDown}
                  />
                </Stack>
                <Stack>
                  <FormLabel htmlFor="password">{t("Password")}</FormLabel>
                  <TextField
                    required
                    fullWidth
                    placeholder="••••••"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handleOnChangePassword}
                    error={passwordEmpty}
                    helperText={passwordHelperText}
                    onKeyDown={handleKeyDown}
                  />
                </Stack>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                >
                  {t('Sign up')}
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ textAlign: 'center' }}>
                  {t('Already have an account? ')}
                  <Link
                    href={newDesUrl(pathnameWithLang, "/log-in")}
                    variant="body2"
                    sx={{ alignSelf: 'center' }}
                  >
                    {t('Sign in')}
                  </Link>
                </Typography>
              </Box>
            </Card>
          </Box>
        </Stack>
      </SignUpContainer>
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
        style={{ top: '80px' }}
        onClose={handleAlertClose2}
      >
        <Alert severity={alertType2} sx={{ width: '100%' }}>
          {alertMessage2}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
