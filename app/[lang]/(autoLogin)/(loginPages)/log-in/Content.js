import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import { useTranslation } from '@/international/myTranslate';
import { siteMarkUrl, FILE_SIZE } from '@/config/config';

const items = [
  {
    icon: <GppMaybeRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Security Tips',
    description:
      'For security reasons, do not use passwords that are commonly used in everyday life. Please do not upload private files.',
  },
  {
    icon: <MiscellaneousServicesRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Server Limitations',
    description:
      'Server Limitations message',
  },
];

export default function Content() {
  const { t, tp, lang } = useTranslation()
  console.log(siteMarkUrl)
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'flex-end' }}>
        <Box>
          <Image
          src={siteMarkUrl}
          height={32}
          width={52}
          layout="intrinsic"
          alt=""
        />
        </Box>
        <Typography fontFamily={'"Delius"'} variant="h5" sx={{ml: '6px', mb: '4px'}}>Drive</Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {t(item.title)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {
                item.title === 'Server Limitations'?
                tp(item.description, {size: FILE_SIZE}):
                t(item.description)
              }
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
