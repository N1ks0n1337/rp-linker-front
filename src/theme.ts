import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#646cff',
        },
        background: {
            paper: 'rgba(0, 0, 0, 0.55)',
        },
    },
    typography: {
        fontFamily: `'Montserrat', sans-serif`,
        h5: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(8px)',
                    borderRadius: '16px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                },
            },
        },
    },
});

export default theme;
