import { useNavigate } from 'react-router-dom';

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
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import CloseIcon from '@mui/icons-material/Close';

import Meta from '../components/Meta';
import { useGetAllOrdersQuery } from '../services/orderApi';

const Orders = () => {
	const navigate = useNavigate();

	const { data: orderData, isLoading, error } = useGetAllOrdersQuery();
	const orders = orderData?.orders;

	return (
		<>
            <Meta title="Orders Management | SHOP" description="Orders Management Page of The SHOP For Admin." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Typography variant="h4" component="h4" fontWeight={700} color="primary" textAlign="center" marginBottom={4}>
						Orders
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
											ORDER ID
										</TableCell>
										<TableCell align="center" size="medium">
											USER
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
											<TableCell align="center">
												<Typography variant="body1" component="p" textAlign="center">
													{order.user._id}
												</Typography>
												<Typography variant="body1" component="p" textAlign="center">
													{order.user.name}
												</Typography>
												<Typography variant="body1" component="p" textAlign="center">
													{order.user.email}
												</Typography>
											</TableCell>
											<TableCell align="center">{order.createdAt.substring(0, 10)}</TableCell>
											<TableCell align="center">${order.totalPrice}</TableCell>
											<TableCell align="center">{order.isPaid ? order.paidAt.substring(0, 10) : <CloseIcon color="error" fontSize="medium" />}</TableCell>
											<TableCell align="center">
												{order.isDelivered ? order.deliveredAt.substring(0, 10) : <CloseIcon color="error" fontSize="medium" />}
											</TableCell>
											<TableCell align="center">
												<Stack direction="row" spacing={1}>
													<Button variant="contained" size="small" color="primary" onClick={() => navigate(`/order/${order._id}`)}>
														Details
													</Button>
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

export default Orders;