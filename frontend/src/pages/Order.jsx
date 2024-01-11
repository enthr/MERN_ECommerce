import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import Meta from '../components/Meta';
import { useGetOrderByIdQuery, useUpdateOrderToPaidByIdMutation, useGetPaypalClientIdQuery, useUpdateOrderToDeliveredByIdMutation } from '../services/orderApi';
import { SERVER } from '../lib/constants';

const Order = () => {
	const { orderId } = useParams();

	const { data: orderData, refetch, isError, isLoading, error } = useGetOrderByIdQuery(orderId);

	const [updateOrderToPaidById, { isLoading: paidLoading }] = useUpdateOrderToPaidByIdMutation();
	const { data: paypal, isLoading: paypalLoading, error: paypalError } = useGetPaypalClientIdQuery();
	const [updateOrderToDeliveredById, { isLoading: deliveredLoading }] = useUpdateOrderToDeliveredByIdMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const { userInfo } = useSelector((state) => state.auth);

	const updateOrderToDeliveredHandler = async (orderId) => {
		try {
			const res = await updateOrderToDeliveredById(orderId).unwrap();

			if (res.success) {
				refetch();
				toast.success('Order Marked Delivered');
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error(error?.data?.message || 'Something Went Wrong');
		}
	};

	useEffect(() => {
		if (!paypalError && !paypalLoading && paypal.clientId) {
			const loadPaypalScript = async () => {
				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': paypal.clientId,
						currency: 'USD'
					}
				});
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			};

			if (orderData?.order && !orderData?.order?.isPaid) {
				if (!window.paypal) {
					loadPaypalScript();
				}
			}
		}
	}, [paypal, paypalLoading, paypalError, orderData, paypalDispatch]);

	const onApprove = async (data, actions) => {
		return actions.order.capture().then(async function (details) {
			try {
				await updateOrderToPaidById({ orderId, details }).unwrap();
				refetch();
				toast.success('Order is Paid');
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		});
	};

	// const onApproveTest = async () => {
	// 	await updateOrderToPaidById({ orderId, details: { payer: {} } });
	// 	refetch();
	// 	toast.success('Order is Paid');
	// };

	const onError = (err) => {
		toast.error(err.message);
	};

	const createOrder = (data, actions) => {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: orderData?.order?.totalPrice }
					}
				]
			})
			.then((orderID) => {
				return orderID;
			});
	};

	return (
		<>
            <Meta title="Order | SHOP" description="Order Page of The SHOP." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Box marginY={8}>
						{isLoading ? (
							<Box width="100%" height="70vh" display="flex" justifyContent="center" alignItems="center">
								<CircularProgress variant="indeterminate" color="secondary" size="6rem" thickness={4} />
							</Box>
						) : isError ? (
							<Box width="100%" height="70vh">
								<Alert variant="filled" severity="error">
									{error?.data?.message || 'Something Went Wrong! Please Try Again Later.'}
								</Alert>
							</Box>
						) : (
							<>
								<Typography variant="h3" component="h3" fontWeight={700} marginBottom={4}>
									Order ID: {orderData?.order?._id}
								</Typography>
								<Grid container spacing={4}>
									<Grid item xs={12} xl={8}>
										<Typography variant="h4" component="h4" fontWeight={700} color="primary">
											Shipping Address
										</Typography>
										<Stack spacing={1} marginTop={2}>
											<Stack direction="row" spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													NAME:
												</Typography>
												<Typography variant="h6" component="h6" fontWeight={400}>
													{orderData?.order?.user?.name}
												</Typography>
											</Stack>
											<Stack direction="row" spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													E-MAIL:
												</Typography>
												<Typography variant="h6" component="h6" fontWeight={400}>
													{orderData?.order?.user?.email}
												</Typography>
											</Stack>
											<Stack direction="row" spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													ADDRESS:
												</Typography>
												<Typography variant="h6" component="h6" fontWeight={400}>
													{orderData?.order?.shippingAddress?.address}
												</Typography>
											</Stack>
											<Stack direction="row" spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													CITY:
												</Typography>
												<Typography variant="h6" component="h6" fontWeight={400}>
													{orderData?.order?.shippingAddress?.city}
												</Typography>
											</Stack>
											<Stack direction="row" spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													POSTAL CODE:
												</Typography>
												<Typography variant="h6" component="h6" fontWeight={400}>
													{orderData?.order?.shippingAddress?.postalCode}
												</Typography>
											</Stack>
											<Stack direction="row" spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													COUNTRY:
												</Typography>
												<Typography variant="h6" component="h6" fontWeight={400}>
													{orderData?.order?.shippingAddress?.country}
												</Typography>
											</Stack>
											<Stack spacing={1}>
												<Typography variant="h6" component="h6" fontWeight={700}>
													STATUS:
												</Typography>
												{orderData?.order?.isDelivered ? (
													<Alert severity="success">Delivered on {orderData?.order?.deliveredAt}</Alert>
												) : (
													<Alert severity="error">Not Delivered</Alert>
												)}
											</Stack>
										</Stack>
										<Divider sx={{ marginY: 4 }} />
										<Typography variant="h4" component="h4" fontWeight={700} color="primary">
											Payment Method
										</Typography>
										<Stack direction="row" spacing={1} marginTop={2}>
											<Typography variant="h6" component="h6" fontWeight={700}>
												TYPE:
											</Typography>
											<Typography variant="h6" component="h6" fontWeight={400}>
												{orderData?.order?.paymentMethod}
											</Typography>
										</Stack>
										<Stack spacing={1}>
											<Typography variant="h6" component="h6" fontWeight={700}>
												STATUS:
											</Typography>
											{orderData?.order?.isPaid ? (
												<Alert severity="success">Paid on {orderData?.order?.paidAt}</Alert>
											) : (
												<Alert severity="error">Not Paid</Alert>
											)}
										</Stack>
										<Divider sx={{ marginY: 4 }} />
										<Typography variant="h4" component="h4" fontWeight={700} color="primary" marginBottom={4}>
											Order Items
										</Typography>
										{orderData?.order?.orderItems?.map((item) => (
											<Box key={item._id}>
												<Card variant="elevation" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
													<Box>
														<Stack direction={{ xs: 'column', md: 'row' }}>
															<Box width={{ xs: '100%', md: '300px' }} height={{ xs: '300px', md: 'auto' }}>
																<CardMedia
																	component="img"
																	image={
																		item?.product?.image.includes('images')
																			? `${SERVER}/uploads${item?.product?.image}`
																			: `${SERVER}/${item?.product?.image}`
																	}
																	alt={item.product.name}
																	height="100%"
																/>
															</Box>
															<Box width={{ xs: '100%' }}>
																<CardContent sx={{ height: '100%' }}>
																	<Stack height="100%" justifyContent="space-between" spacing={{ xs: 4, md: 0 }}>
																		<Typography variant="h5" component="h5" fontWeight={700}>
																			{item.product.name}
																		</Typography>
																		<Typography variant="h6" component="h6" color="text.primary">
																			${item.price}
																		</Typography>
																		<Typography variant="h6" component="h6" color="text.secondary">
																			{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
																		</Typography>
																	</Stack>
																</CardContent>
															</Box>
														</Stack>
													</Box>
												</Card>
												<Divider sx={{ marginY: 4 }} />
											</Box>
										))}
									</Grid>

									<Grid item xs={12} xl={4}>
										<Paper variant="outlined" sx={{ paddingX: 4 }}>
											<Stack direction="row" justifyContent="center" alignItems="center" marginY={4}>
												<Typography variant="h4" component="h4" color="primary" fontWeight={700} textAlign="center">
													Order Summary
												</Typography>
											</Stack>
											<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={4}>
												<Typography variant="h5" component="h5">
													Total Items:
												</Typography>
												<Typography variant="h5" component="h5" fontWeight={700} color="primary">
													{orderData?.order?.orderItems.length}
												</Typography>
											</Stack>
											<Divider />
											<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={4}>
												<Typography variant="h5" component="h5">
													Subtotal:
												</Typography>
												<Typography variant="h5" component="h5" fontWeight={700} color="primary">
													${orderData?.order?.itemsPrice}
												</Typography>
											</Stack>
											<Divider />
											<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={4}>
												<Typography variant="h5" component="h5">
													Shipping:
												</Typography>
												<Typography variant="h5" component="h5" fontWeight={700} color="primary">
													${orderData?.order?.shippingPrice}
												</Typography>
											</Stack>
											<Divider />
											<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={4}>
												<Typography variant="h5" component="h5">
													Tax:
												</Typography>
												<Typography variant="h5" component="h5" fontWeight={700} color="primary">
													${orderData?.order?.taxPrice}
												</Typography>
											</Stack>
											<Divider />
											<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={4}>
												<Typography variant="h5" component="h5">
													Total:
												</Typography>
												<Typography variant="h5" component="h5" fontWeight={700} color="primary">
													${orderData?.order?.totalPrice}
												</Typography>
											</Stack>
											{!orderData?.order?.isPaid && userInfo.role === 0 ? (
												<>
													<Divider />
													<Box marginY={4}>
														{paypalLoading || paidLoading || isPending ? (
															<Stack justifyContent="center" alignItems="center">
																<CircularProgress color="secondary" thickness={5} size="3rem" />
															</Stack>
														) : (
															<Stack spacing={4}>
																<PayPalButtons
																	style={{ layout: 'vertical', shape: 'rect' }}
																	createOrder={createOrder}
																	onApprove={onApprove}
																	onError={onError}
																></PayPalButtons>
															</Stack>
														)}
													</Box>
												</>
											) : (
												<></>
											)}
											{userInfo && userInfo.role === 1 && orderData?.order.isPaid && !orderData?.order.isDelivered ? (
												<>
													<Divider />
													<Box marginY={4}>
														{deliveredLoading ? (
															<Stack justifyContent="center" alignItems="center">
																<CircularProgress color="secondary" thickness={5} size="3rem" />
															</Stack>
														) : (
															<Stack spacing={4}>
																<Button
																	startIcon={<LocalShippingIcon />}
																	variant="contained"
																	color="primary"
																	size="large"
																	onClick={() => updateOrderToDeliveredHandler(orderData.order._id)}
																>
																	Mark As Delivered
																</Button>
															</Stack>
														)}
													</Box>
												</>
											) : null}
										</Paper>
									</Grid>
								</Grid>
							</>
						)}
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Order;
