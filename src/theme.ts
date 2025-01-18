import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#65c3c8', // daisyUI primary
      light: '#8cd2d6',
      dark: '#47888c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ef9fbc', // daisyUI secondary
      light: '#f4b9ce',
      dark: '#e77ea2',
      contrastText: '#291334',
    },
    warning: {
      main: '#eeaf3a', // daisyUI accent
      light: '#f2c265',
      dark: '#c79023',
      contrastText: '#291334',
    },
    text: {
      primary: '#291334', // daisyUI base-content
      secondary: 'rgba(41, 19, 52, 0.7)', // Adjusted for readability
      disabled: 'rgba(41, 19, 52, 0.38)',
    },
    background: {
      default: '#faf7f5', // daisyUI base-100
      paper: '#efeae6', // daisyUI base-200
    },
    neutral: {
      main: '#291334', // daisyUI neutral
      light: '#3d1d4d',
      dark: '#1a0c22',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#faf7f5',  // daisyUI base-100
      100: '#efeae6', // daisyUI base-200
      200: '#e7e2df', // daisyUI base-300
      300: '#d8d0cc',
      400: '#bbb1ac',
      500: '#9e938d',
      600: '#82756e',
      700: '#665a54',
      800: '#4a403b',
      900: '#2e2622',
      A100: '#faf7f5',
      A200: '#efeae6',
      A400: '#e7e2df',
      A700: '#d8d0cc',
    },
  },
  shape: {
    borderRadius: 19, // daisyUI --rounded-btn: 1.9rem
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 19, // daisyUI --rounded-btn
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(41, 19, 52, 0.2)',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 7, // daisyUI --tab-radius
          backgroundColor: '#efeae6', // daisyUI base-200
          boxShadow: '0px 2px 4px rgba(41, 19, 52, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#efeae6', // daisyUI base-200
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(41, 19, 52, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(41, 19, 52, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 6px 12px rgba(41, 19, 52, 0.1)',
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#faf7f5', // daisyUI base-100
          color: '#291334', // daisyUI base-content
          boxShadow: '0px 1px 3px rgba(41, 19, 52, 0.1)',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#faf7f5', // daisyUI base-100
          borderRight: '2px solid #e7e2df', // daisyUI base-300
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 7, // daisyUI --tab-radius
          backgroundColor: '#faf7f5', // daisyUI base-100
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e7e2df', // daisyUI base-300
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 7, // daisyUI --tab-radius
            '& fieldset': {
              borderWidth: '2px', // daisyUI --tab-border
              borderColor: '#e7e2df', // daisyUI base-300
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 7, // daisyUI --tab-radius
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 19, // daisyUI --rounded-btn
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#65c3c8', // daisyUI primary
          color: '#ffffff',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 7, // daisyUI --tab-radius
          '&.Mui-selected': {
            backgroundColor: 'rgba(101, 195, 200, 0.08)', // primary with opacity
          },
        },
      },
    },
  },
});

// Add custom colors to the theme type
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}
