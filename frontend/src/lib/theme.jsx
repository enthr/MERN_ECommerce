import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
            '3xl': 1600
        }
    },
	palette: {
		mode: 'light',
		common: {
			black: '#000000',
			white: '#ffffff'
		},
		primary: {
			main: '#303f9f',
			light: '#3f51b5',
			dark: '#1a237e',
			contrastText: '#fafafa'
		},
		secondary: {
			main: '#fbc02d',
			light: '#ffeb3b',
			dark: '#f57f17',
			contrastText: '#fafafa'
		},
		error: {
			main: '#d32f2f',
			light: '#f44336',
			dark: '#b71c1c',
			contrastText: '#fafafa'
		},
		warning: {
			main: '#e64a19',
			light: '#e64a19',
			dark: '#bf360c',
			contrastText: '#fafafa'
		},
		info: {
			main: '#1976d2',
			light: '#2196f3',
			dark: '#0d47a1',
			contrastText: '#fafafa'
		},
		success: {
			main: '#388e3c',
			light: '#4caf50',
			dark: '#1b5e20',
			contrastText: '#fafafa'
		}
	}
});

export const darkTheme = createTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
            '3xl': 1600
        }
    },
	palette: {
		mode: 'dark',
		common: {
			black: '#000000',
			white: '#ffffff'
		},
		primary: {
			main: '#303f9f',
			light: '#3f51b5',
			dark: '#1a237e',
			contrastText: '#fafafa'
		},
		secondary: {
			main: '#fbc02d',
			light: '#ffeb3b',
			dark: '#f57f17',
			contrastText: '#fafafa'
		},
		error: {
			main: '#d32f2f',
			light: '#f44336',
			dark: '#b71c1c',
			contrastText: '#fafafa'
		},
		warning: {
			main: '#e64a19',
			light: '#e64a19',
			dark: '#bf360c',
			contrastText: '#fafafa'
		},
		info: {
			main: '#1976d2',
			light: '#2196f3',
			dark: '#0d47a1',
			contrastText: '#fafafa'
		},
		success: {
			main: '#388e3c',
			light: '#4caf50',
			dark: '#1b5e20',
			contrastText: '#fafafa'
		}
	}
});