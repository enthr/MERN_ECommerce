import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Meta from '../components/Meta';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import { SERVER } from '../lib/constants';

const Cart = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;

	const checkoutHandler = () => {
		navigate('/login?redirect=shipping-address');
	};

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id));
	};

	const addToCartHandler = (item, qty) => {
		dispatch(addToCart({ ...item, qty }));
	};

	return (
		<>
            <Meta title="Cart | SHOP" description="Shopping Cart Page of The SHOP." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Typography variant="h2" component="h2" marginY={4} fontWeight={700} fontSize={{ xs: '2rem', sm: '3.75rem' }}>
						Shopping Cart
					</Typography>

					{cartItems?.length === 0 ? (
						<Box width="100%" height="60vh">
							<Alert variant="filled" severity="info">
								{'Your Cart is Empty.'}
							</Alert>
						</Box>
					) : (
						<Grid container spacing={4}>
							<Grid item xs={12} xl={8}>
								{cartItems?.map((item) => (
									<Box key={item._id}>
										<Card variant="elevation" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
											<Box width={{ xs: '100%', md: '85%' }}>
												<CardActionArea sx={{ width: '100%' }}>
													<Link component={RouterLink} to={`/product/${item._id}`} underline="none">
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
													</Link>
												</CardActionArea>
											</Box>
											<Box width={{ xs: '100%', md: '15%' }}>
												<CardActions sx={{ width: '100%', height: '100%' }}>
													<Stack
														width="100%"
														height="100%"
														direction={{ xs: 'row', md: 'column' }}
														justifyContent={{ xs: 'space-evenly', md: 'center' }}
														spacing={3}
														alignItems="center"
													>
														<Stack direction="row" alignItems="center" spacing={1}>
															<IconButton
																size="large"
																onClick={() => addToCartHandler(item, 1)}
																disabled={item.countInStock === 0 || item.countInStock === item.qty ? true : false}
															>
																<AddIcon />
															</IconButton>
															<Typography variant="h6" component="h6" fontWeight={700} color="primary">
																{item.qty}
															</Typography>
															<IconButton
																size="large"
																onClick={() => addToCartHandler(item, -1)}
																disabled={item.countInStock === 0 || item.qty === 1 ? true : false}
															>
																<RemoveIcon />
															</IconButton>
														</Stack>
														<IconButton size="large" color="error" onClick={() => removeFromCartHandler(item._id)}>
															<DeleteIcon />
														</IconButton>
													</Stack>
												</CardActions>
											</Box>
										</Card>
										<Divider sx={{ marginY: 4 }} />
									</Box>
								))}
							</Grid>

							<Grid item xs={12} xl={4}>
								<Paper variant="outlined" sx={{ paddingX: 4 }}>
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h4" component="h4">
											Total Items:
										</Typography>
										<Typography variant="h4" component="h4" fontWeight={700} color="primary">
											{cartItems.reduce((acc, item) => acc + item.qty, 0)}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={5}>
										<Typography variant="h4" component="h4">
											Subtotal:
										</Typography>
										<Typography variant="h4" component="h4" fontWeight={700} color="primary">
											${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
										</Typography>
									</Stack>
									<Divider />
									<Box marginY={5}>
										<Button variant="contained" size="large" fullWidth={true} disabled={cartItems.length === 0 ? true : false} onClick={checkoutHandler}>
											<Typography variant="h5" component="h5" fontWeight={700} paddingY={2}>
												Proceed To Checkout
											</Typography>
										</Button>
									</Box>
								</Paper>
							</Grid>
						</Grid>
					)}
				</Container>
			</Box>
		</>
	);
};

export default Cart;