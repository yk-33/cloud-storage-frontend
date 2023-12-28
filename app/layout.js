"use client"

import CssBaseline from '@mui/material/CssBaseline';
import store from "./store";
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';


const theme = createTheme({
  palette: {
    background: {
      default: '#f7f9fc',

    },
    custom: {
      black: '#3d3d3d',
      blue: '#c2e7ff',
    }
  },
  typography: {
    subtitle1: {
      color: '#3d3d3d',
      fontWeight: '600',
    },
    subtitle2: {
      color: '#3d3d3d',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    body1: {
      fontWeight: '500',
      color: grey[800]
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    caption: {
      fontWeight: '600',
    }
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#c2e7ff',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#c2e7ff',
          },
        },
      }
    },
    MuiDivider:{
      styleOverrides:{
        root:{
          borderColor: grey[400]
        }
      }
    }
  },
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <CssBaseline />
            {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html >
  )
}
