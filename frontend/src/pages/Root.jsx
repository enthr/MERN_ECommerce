import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { lightTheme, darkTheme } from '../lib/theme';

const Root = () => {
    const [darkMode, setDarkMode] = useState(false);
	return (
		<ThemeProvider theme={(darkMode) ? darkTheme : lightTheme}>
            <CssBaseline />
            <Outlet />
		</ThemeProvider>
	);
};

export default Root;