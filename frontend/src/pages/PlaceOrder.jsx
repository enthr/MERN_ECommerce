import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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

import Meta from '../components/Meta';
import Steps from '../components/Steps';
import { clearCartItems } from '../features/cart/cartSlice';
import { useCreateOrderMutation } from '../services/orderApi';
import { SERVER } from '../lib/constants';

const PlaceOrder = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { cartItems, shippingAddress, paymentMethod } = cart;

	const [createOrder, { isLoading, error }] = useCreateOrderMutation();

	const placeOrderHandler = async () => {
		if (cartItems.length === 0) {
			navigate('/cart');
			return;
		}

		try {
			const orderItems = cartItems.map((item) => {
				return {
					product: item._id,
					qty: item.qty,
					price: item.price
				};
			});

			const res = await createOrder({
				orderItems: orderItems,
				shippingAddress: {
					address: shippingAddress.address,
					city: shippingAddress.city,
					postalCode: shippingAddress.postalCode,
					country: shippingAddress.country
				},
				paymentMethod: paymentMethod
			}).unwrap();

			if (res.success) {
				toast.success('Order Placed Successfully!');
				dispatch(clearCartItems());
				navigate(`/order/${res.order._id}`);
				return;
			} else {
				toast.error(error.message || 'Something Went Wrong!');
				return;
			}
		} catch (err) {
			toast.error(err.message || 'Something Went Wrong!');
		}
	};

	useEffect(() => {
		if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
			navigate('/shipping-address');
		}
		if (!paymentMethod) {
			navigate('/payment-method');
		}
	}, [shippingAddress, paymentMethod, cartItems, navigate]);

	return (
		<>
            <Meta title="Place Order | SHOP" description="Place Order Page of The SHOP Checkout Process." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Box>
						<Steps activeStep={1} />
					</Box>
					<Box marginY={8}>
						<Grid container spacing={4}>
							<Grid item xs={12} xl={8}>
								<Typography variant="h4" component="h4" fontWeight={700} color="primary">
									Shipping Address
								</Typography>
								<Stack spacing={1} marginTop={2}>
									<Stack direction="row" spacing={1}>
										<Typography variant="h6" component="h6" fontWeight={700}>
											ADDRESS:
										</Typography>
										<Typography variant="h6" component="h6" fontWeight={400}>
											{shippingAddress.address}
										</Typography>
									</Stack>
									<Stack direction="row" spacing={1}>
										<Typography variant="h6" component="h6" fontWeight={700}>
											CITY:
										</Typography>
										<Typography variant="h6" component="h6" fontWeight={400}>
											{shippingAddress.city}
										</Typography>
									</Stack>
									<Stack direction="row" spacing={1}>
										<Typography variant="h6" component="h6" fontWeight={700}>
											POSTAL CODE:
										</Typography>
										<Typography variant="h6" component="h6" fontWeight={400}>
											{shippingAddress.postalCode}
										</Typography>
									</Stack>
									<Stack direction="row" spacing={1}>
										<Typography variant="h6" component="h6" fontWeight={700}>
											COUNTRY:
										</Typography>
										<Typography variant="h6" component="h6" fontWeight={400}>
											{shippingAddress.country}
										</Typography>
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
										{paymentMethod}
									</Typography>
								</Stack>
								<Divider sx={{ marginY: 4 }} />
								<Typography variant="h4" component="h4" fontWeight={700} color="primary" marginBottom={4}>
									Order Items
								</Typography>
								{cartItems?.map((item) => (
									<Box key={item._id}>
										<Card variant="elevation" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
											<Box>
												<Stack direction={{ xs: 'column', md: 'row' }}>
													<Box width={{ xs: '100%', md: '300px' }} height={{ xs: '300px', md: 'auto' }}>
														<CardMedia
															component="img"
															image={item?.image.includes('images') ? `${SERVER}/uploads${item?.image}` : `${SERVER}/${item?.image}`}
															alt={item.name}
															height="100%"
														/>
													</Box>
													<Box width={{ xs: '100%' }}>
														<CardContent sx={{ height: '100%' }}>
															<Stack height="100%" justifyContent="space-between" spacing={{ xs: 4, md: 0 }}>
																<Typography variant="h5" component="h5" fontWeight={700}>
																	{item.name}
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
									<Stack direction="row" justifyContent="center" alignItems="center" marginY={5}>
										<Typography variant="h4" component="h4" color="primary" fontWeight={700} textAlign="center">
											Order Summary
										</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h5" component="h5">
											Total Items:
										</Typography>
										<Typography variant="h5" component="h5" fontWeight={700} color="primary">
											{cartItems.length}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h5" component="h5">
											Subtotal:
										</Typography>
										<Typography variant="h5" component="h5" fontWeight={700} color="primary">
											${cart?.itemsPrice}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h5" component="h5">
											Shipping:
										</Typography>
										<Typography variant="h5" component="h5" fontWeight={700} color="primary">
											${cart?.shippingPrice}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h5" component="h5">
											Tax:
										</Typography>
										<Typography variant="h5" component="h5" fontWeight={700} color="primary">
											${cart?.taxPrice}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h5" component="h5">
											Total:
										</Typography>
										<Typography variant="h5" component="h5" fontWeight={700} color="primary">
											${cart?.totalPrice}
										</Typography>
									</Stack>
									<Divider />
									<Box marginY={5}>
										{isLoading ? (
											<Stack justifyContent="center" alignItems="center">
												<CircularProgress color="secondary" thickness={5} size="3rem" />
											</Stack>
										) : (
											<Button variant="contained" size="large" fullWidth={true} disabled={cartItems.length === 0 ? true : false} onClick={placeOrderHandler}>
												<Typography variant="h5" component="h5" fontWeight={700} paddingY={1}>
													Place Order
												</Typography>
											</Button>
										)}
									</Box>
								</Paper>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default PlaceOrder;