import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Box } from '@mui/material';


const WhiteTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#E9EEF6',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
      boxShadow: theme.shadows[3],
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#E9EEF6',
      "&:before": {
      border: "1px solid #dadde9",
      boxShadow: theme.shadows[3],
    },
    },
  }));

  export default WhiteTooltip