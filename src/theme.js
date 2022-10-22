import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(55, 125, 255)',
    },
    secondary: {
      main: 'rgb(247, 250, 255)',
    },
    delete: {
      main: '#ef5350',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;   