import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import { useTranslation } from '@/international/myTranslate';
import { SitemarkIcon } from './CustomIcons';

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
      'Server performance has its limits, and the maximum file size that can be uploaded is set to 2MB.',
  },
];

export default function Content() {
  const { t, lang } = useTranslation()
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {t(item.title)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t(item.description)}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
