"use client"

import CssBaseline from '@mui/material/CssBaseline';
import store from "@/store";
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { grey, green } from '@mui/material/colors';
import './global.css'
import { LocaleContext } from '@/international/myTranslate';

let theme = createTheme({
  palette: {
    background: {
      default: '#f7f9fc',

    },
    custom: {
      black: '#3d3d3d',
      blue: '#c2e7ff',
      searchBarBlue: '#e9eef6',
    },
  },
  typography: {
    h5: {
      color: 'black'
    },
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
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: grey[400]
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        sizeSmall: {
          fontSize: '0.875rem'
        }
      }
    }
  },
})

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    login: theme.palette.augmentColor({
      color: {
        main: green[600],
      },
      name: 'login',
    }),
  },
});

export default function RootLayout({ children, params }) {
  
  return (
    <html lang={params.lang}>
      <body >
        <ThemeProvider theme={theme}>
          <LocaleContext.Provider value={params.lang}>
          <Provider store={store}>
            <CssBaseline enableColorScheme />
            {children}
          </Provider>
          </LocaleContext.Provider>
        </ThemeProvider>
      </body>
    </html >
  )
}
