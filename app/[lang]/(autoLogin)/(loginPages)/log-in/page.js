'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import SignInCard from './SignInCard';
import Content from './Content';
import AppTheme from '@/components/shared-theme/AppTheme';
import { useRouter, usePathname } from 'next/navigation'
import { newLanguageUrl, urlWithoutLanguage, newDesUrl } from '@/utils/urlFunctions';
import { useTranslation } from '@/international/myTranslate';
import { Box } from '@mui/material';
import { Select } from 'antd';

export default function SignInSide(props) {
  const router = useRouter()
  const pathnameWithLang = usePathname()
  const pathname = urlWithoutLanguage(pathnameWithLang)
  const { t, lang } = useTranslation()

  const switchLanguage = (value) => {
    let newPathname = newLanguageUrl(pathname, value)
    router.push(newPathname)
  };
  return (
    <AppTheme {...props}>
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
            minHeight: '100%',
          },
          (theme) => ({
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
          }),
        ]}
      >
        <Stack
          direction={{ xs: 'column', md: 'row-reverse' }}
          sx={{
            justifyContent: 'center',
            minHeight: '100%',
            gap: { xs: 6, sm: 0 },
            p: 2,
            mx: 2,
          }}
        >
          <Box sx={{ position: 'relative', height: '64px', minWidth:'120px',
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
          <Stack
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{
              justifyContent: 'center',
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: 'auto',
            }}
          >
            <Content />
            <SignInCard />
          </Stack>
        </Stack>
      </Stack>
    </AppTheme>
  );
}
