import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { lightTheme, darkTheme } from '../lib/theme';

import 'react-toastify/dist/ReactToastify.min.css';

const Root = () => {
    const darkMode = useSelector((state) => state.theme.darkMode);

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<Header />
			<Outlet />
			<Footer />
			<ToastContainer position="bottom-right" theme='dark' pauseOnHover autoClose={5000} />
		</ThemeProvider>
	);
};

export default Root;