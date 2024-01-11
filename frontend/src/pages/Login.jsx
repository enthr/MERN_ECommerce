import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';

import LoginIcon from '@mui/icons-material/Login';

import Meta from '../components/Meta';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../services/userApi';

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { search } = useLocation();
	const searchParams = new URLSearchParams(search);
	const redirect = searchParams.get('redirect') || '/';

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { userInfo } = useSelector((state) => state.auth);
	const [login, { isLoading }] = useLoginMutation();

	const loginHandler = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error('Please Fill In All Fields.');
			return;
		}

		try {
			const res = await login({ email, password }).unwrap();
			dispatch(setCredentials(res.user));
			toast.success('Logged In Successfully.');
			navigate(redirect);
		} catch (error) {
			toast.error(error?.data?.message || 'Something Went Wrong.');
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, redirect, navigate]);

	return (
		<>
            <Meta title="Login | SHOP" description="Login Page of The SHOP." />
			<Box component="main" marginY={{ xs: 4, lg: 14 }}>
				<Container maxWidth="3xl">
					<Paper variant="outlined" sx={{ width: { xs: '100%', lg: '50%' }, marginX: 'auto' }}>
						<Stack spacing={6} padding={{ xs: 4, lg: 8 }} alignItems="center">
							<Typography color="primary" variant="h3" component="h3" align="center" fontWeight={700} width="100%">
								Login
							</Typography>
							<TextField
								fullWidth={true}
								required={true}
								id="email"
								label="Email"
								variant="outlined"
								margin="normal"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="password"
								label="Password"
								variant="outlined"
								margin="normal"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							{isLoading ? (
								<CircularProgress color="secondary" thickness={4} size="4rem" />
							) : (
								<Button
									variant="contained"
									startIcon={<LoginIcon />}
									size="large"
									disabled={isLoading}
									onClick={loginHandler}
									sx={{ width: '100%', paddingY: 1.5 }}
								>
									Login
								</Button>
							)}

							<Typography variant="body1" component="p" align="center">
								Don&apos;t Have An Account ?{' '}
								<Link component={RouterLink} to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} fontWeight={700} underline="hover">
									Register
								</Link>
							</Typography>
						</Stack>
					</Paper>
				</Container>
			</Box>
		</>
	);
};

export default Login;