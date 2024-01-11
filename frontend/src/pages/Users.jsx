import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Meta from '../components/Meta';
import { useGetAllUsersQuery, useDeleteUserByIdMutation } from '../services/userApi';

const Users = () => {
	const navigate = useNavigate();

	const { data: userData, isLoading, error, refetch } = useGetAllUsersQuery();
	const users = userData?.users;

	const [deleteUserById, { isLoading: deleteUserLoading }] = useDeleteUserByIdMutation();

	const deleteProductHandler = async (userId) => {
		try {
			if (window.confirm('Are You Sure You Want To Delete This User ?')) {
				const res = await deleteUserById(userId).unwrap();

				if (res.success) {
					refetch();
					toast.success('User Deleted Successfully.');
				} else {
					toast.error(res.message || 'Something Went Wrong.');
				}
			}
		} catch (error) {
			toast.error(error.data.message || 'Something Went Wrong.');
		}
	};

	return (
		<>
            <Meta title="Users Management | SHOP" description="Users Management Page of The SHOP For Admin." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Typography variant="h4" component="h4" fontWeight={700} color="primary" textAlign="center" marginBottom={4}>
						Users
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
											USER ID
										</TableCell>
										<TableCell align="center" size="medium">
											NAME
										</TableCell>
										<TableCell align="center" size="medium">
											E-MAIL
										</TableCell>
										<TableCell align="center" size="medium">
											ROLE
										</TableCell>
										<TableCell align="center" size="medium"></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users?.map((user) => (
										<TableRow key={user._id}>
											<TableCell align="center">{user._id}</TableCell>
											<TableCell align="center">{user.name}</TableCell>
											<TableCell align="center">{user.email}</TableCell>
											<TableCell align="center">{user.role === 1 ? 'ADMIN' : 'USER'}</TableCell>
											<TableCell align="center">
												<Stack direction="row" spacing={1}>
													<Tooltip title="Edit Product">
														<IconButton variant="contained" size="small" color="secondary" onClick={() => navigate(`/admin/user/edit/${user._id}`)}>
															<EditIcon />
														</IconButton>
													</Tooltip>
													{deleteUserLoading ? (
														<CircularProgress color="secondary" thickness={4} size="2rem" />
													) : (
														<Tooltip title="Delete Product">
															<IconButton variant="contained" size="small" color="error" onClick={() => deleteProductHandler(user._id)}>
																<DeleteIcon />
															</IconButton>
														</Tooltip>
													)}
												</Stack>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Container>
			</Box>
		</>
	);
};

export default Users;