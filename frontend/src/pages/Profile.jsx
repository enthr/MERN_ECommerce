import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import Meta from '../components/Meta';
import { useGetUserOrdersQuery } from '../services/orderApi';
import { useUpdateProfileMutation } from '../services/userApi';
import { setCredentials } from '../features/auth/authSlice';

const Profile = () => {
	const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { userInfo } = useSelector((state) => state.auth);
	const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateProfileMutation();

	const { data: orderData, isLoading, error } = useGetUserOrdersQuery();
	const orders = orderData?.orders;

	const updateProfileHandler = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error('Please Fill In All Fields.');
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords Do Not Match.');
			return;
		}

		try {
			const res = await updateProfile({ name, email, password }).unwrap();

			if (res.success) {
				dispatch(setCredentials(res.user));
				toast.success('Profile Updated Successfully.');
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error(error?.data?.message || 'Something Went Wrong.');
		}
	};

	useEffect(() => {
		if (userInfo) {
			setName(userInfo.name);
			setEmail(userInfo.email);
		}
	}, [userInfo]);

	return (
		<>
            <Meta title="Profile | SHOP" description="Profile Page of The SHOP." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<Typography variant="h4" component="h4" fontWeight={700} color="primary" textAlign="center" marginBottom={4}>
								User Profile
							</Typography>
							<Paper variant="outlined">
								<Stack padding={4} spacing={4}>
									<TextField
										fullWidth={true}
										required={true}
										id="name"
										label="Name"
										variant="outlined"
										margin="normal"
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
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
									<TextField
										fullWidth={true}
										required={true}
										id="confirmPassword"
										label="Confirm Password"
										variant="outlined"
										margin="normal"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
									{loadingUpdateProfile ? (
										<CircularProgress color="secondary" thickness={4} size="4rem" />
									) : (
										<Button
											variant="contained"
											startIcon={<SaveIcon />}
											size="large"
											disabled={loadingUpdateProfile}
											onClick={updateProfileHandler}
											sx={{ width: '100%', paddingY: 1.5 }}
										>
											Update Profile
										</Button>
									)}
								</Stack>
							</Paper>
						</Grid>

						<Grid item xs={12} lg={8}>
							<Typography variant="h4" component="h4" fontWeight={700} color="primary" textAlign="center" marginBottom={4}>
								My Orders
							</Typography>
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center">
									<CircularProgress color="secondary" thickness={6} size="6rem" />
								</Box>
							) : error ? (
								<Box>
									<Alert severity="error">{error?.data?.message || 'Something Went Wrong.'}</Alert>
								</Box>
							) : (
								<TableContainer component={Paper} variant="outlined">
									<Table aria-label="orders table">
										<TableHead>
											<TableRow>
												<TableCell align="center" size="medium">
													ID
												</TableCell>
												<TableCell align="center" size="medium">
													DATE
												</TableCell>
												<TableCell align="center" size="medium">
													TOTAL
												</TableCell>
												<TableCell align="center" size="medium">
													PAID
												</TableCell>
												<TableCell align="center" size="medium">
													DELIVERED
												</TableCell>
												<TableCell align="center" size="medium"></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{orders?.map((order) => (
												<TableRow key={order._id}>
													<TableCell align="center">{order._id}</TableCell>
													<TableCell align="center">{order.createdAt.substring(0, 10)}</TableCell>
													<TableCell align="center">${order.totalPrice}</TableCell>
													<TableCell align="center">
														{order.isPaid ? order.paidAt.substring(0, 10) : <CloseIcon color="error" fontSize="medium" />}
													</TableCell>
													<TableCell align="center">
														{order.isDelivered ? order.deliveredAt.substring(0, 10) : <CloseIcon color="error" fontSize="medium" />}
													</TableCell>
													<TableCell align="center">
														<Link component={RouterLink} to={`/order/${order._id}`} underline="none">
															<Button variant="contained" size="small" color="primary">
																Details
															</Button>
														</Link>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

export default Profile;