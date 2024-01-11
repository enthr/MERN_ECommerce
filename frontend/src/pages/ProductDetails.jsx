import { useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Meta from '../components/Meta';
import { addToCart } from '../features/cart/cartSlice';
import { useGetProductByIdQuery } from '../services/productApi';
import { useGetAllProductReviewsQuery, useCreateReviewMutation } from '../services/reviewApi';
import { SERVER } from '../lib/constants';

const ProductDetails = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { productId } = useParams();
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const { userInfo } = useSelector((state) => state.auth);

	const { data, isLoading, error, isError } = useGetProductByIdQuery(productId);
	const product = data?.product;
	const imageSrc = product?.image.includes('images') ? `${SERVER}/uploads${product?.image}` : `${SERVER}/${product?.image}`;

	const { data: reveiwsData, isLoading: reviewsLoading, refetch } = useGetAllProductReviewsQuery(productId);
	const reviews = reveiwsData?.reviews;

	const [createReview, { isLoading: createReviewLoading }] = useCreateReviewMutation();

	const createReviewHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await createReview({ productId, rating, comment }).unwrap();

			if (res.success) {
				refetch();
				toast.success('Review Created Successfully.');
			} else {
				toast.error(res.message || 'Something Went Wrong.');
			}
		} catch (err) {
			toast.error(err.data.message || 'Something Went Wrong.');
		}
	};

	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, qty: qty }));
		navigate('/cart');
	};

	return (
		<>
            <Meta title={`Product Details | SHOP`} description={`Product Details Page of The SHOP.`} />
			<Box component="main" marginY={8}>
				<Container maxWidth="3xl">
					<Link component={RouterLink} to="/">
						<Button variant="contained" size="large" startIcon={<ArrowBackIcon />}>
							Go Back
						</Button>
					</Link>

					{isLoading ? (
						<Box width="100%" height="60vh" display="flex" justifyContent="center" alignItems="center">
							<CircularProgress variant="indeterminate" color="secondary" size="6rem" thickness={4} />
						</Box>
					) : isError ? (
						<Box width="100%" height="60vh" marginTop={8}>
							<Alert variant="filled" severity="error">
								{error?.data?.message || 'Something Went Wrong! Please Try Again Later.'}
							</Alert>
						</Box>
					) : (
						<>
							<Box marginTop={4}>
								<Typography variant="h2" component="h2">
									{product.name}
								</Typography>
								<Divider sx={{ marginY: 4 }} />
								<Typography variant="h3" component="h3">
									{product.brand}
								</Typography>
							</Box>

							<Grid container columnSpacing={4} rowSpacing={4} marginY={2}>
								<Grid item xs={12} lg={8}>
									<img src={imageSrc} alt={product.name} style={{ width: '100%', height: '100%' }} />
								</Grid>
								<Grid item xs={12} lg={4}>
									<Paper variant="outlined" sx={{ paddingX: 4, width: '100%' }}>
										<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={6}>
											<Typography variant="h4" component="h4">
												Price:
											</Typography>
											<Typography variant="h4" component="h4" fontWeight={700} color="primary">
												${product.price}
											</Typography>
										</Stack>
										<Divider />
										<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={6}>
											<Typography variant="h4" component="h4">
												Status:
											</Typography>
											<Typography variant="h4" component="h4" fontWeight={700} color="primary">
												{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
											</Typography>
										</Stack>
										<Divider />
										<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={6}>
											<Typography variant="h4" component="h4">
												Qty:
											</Typography>
											<Stack direction="row" alignItems="center" spacing={1}>
												<IconButton
													size="large"
													onClick={() => setQty((prevQty) => prevQty + 1)}
													disabled={product.countInStock === 0 || product.countInStock === qty ? true : false}
												>
													<AddIcon />
												</IconButton>
												<Typography variant="h4" component="h4" fontWeight={700} color="primary">
													{product.countInStock === 0 ? 0 : qty}
												</Typography>
												<IconButton
													size="large"
													onClick={() => setQty((prevQty) => prevQty - 1)}
													disabled={product.countInStock === 0 || qty === 1 ? true : false}
												>
													<RemoveIcon />
												</IconButton>
											</Stack>
										</Stack>
										<Divider />
										<Stack direction="row" justifyContent="space-between" alignItems="center" marginY={6}>
											<Button
												variant="contained"
												size="large"
												fullWidth={true}
												disabled={product.countInStock === 0 ? true : false}
												onClick={addToCartHandler}
											>
												<Typography variant="h5" component="h5" fontWeight={700} paddingY={2}>
													Add To Cart
												</Typography>
											</Button>
										</Stack>
									</Paper>
								</Grid>
							</Grid>

							<Grid container rowSpacing={0} columnSpacing={0} marginY={8}>
								<Grid item xs={3} border={1} padding={2}>
									<Typography variant="h5" component="h5">
										Category:
									</Typography>
								</Grid>
								<Grid item xs={9} border={1} padding={2}>
									<Typography variant="h5" component="h5" fontWeight={500}>
										{product.category?.name}
									</Typography>
								</Grid>
								<Grid item xs={3} border={1} padding={2}>
									<Typography variant="h5" component="h5">
										Brand:
									</Typography>
								</Grid>
								<Grid item xs={9} border={1} padding={2}>
									<Typography variant="h5" component="h5" fontWeight={500}>
										{product.brand}
									</Typography>
								</Grid>
								<Grid item xs={3} border={1} padding={2}>
									<Typography variant="h5" component="h5">
										Name:
									</Typography>
								</Grid>
								<Grid item xs={9} border={1} padding={2}>
									<Typography variant="h5" component="h5" fontWeight={500}>
										{product.name}
									</Typography>
								</Grid>
								<Grid item xs={3} border={1} padding={2}>
									<Typography variant="h5" component="h5">
										Rating:
									</Typography>
								</Grid>
								<Grid item xs={9} border={1} padding={2}>
									<Rating name={`${product._id}_rating`} size="large" value={product.rating || 0} precision={0.1} readOnly />
								</Grid>
								<Grid item xs={3} border={1} padding={2}>
									<Typography variant="h5" component="h5">
										Description:
									</Typography>
								</Grid>
								<Grid item xs={9} border={1} padding={2}>
									<Typography variant="h5" component="h5" fontWeight={500}>
										{product.description}
									</Typography>
								</Grid>
							</Grid>

							<Grid container spacing={4}>
								<Grid item xs={12}>
									<Typography variant="h3" component="h3" color="primary" fontWeight={700}>
										Reviews
									</Typography>
								</Grid>
								{reviews?.length === 0 ? (
									<Grid item xs={12}>
										<Alert severity="info">No Reviews</Alert>
									</Grid>
								) : (
									<Grid item xs={12}>
										{reviewsLoading ? (
											<Box width="100%" height="60vh" display="flex" justifyContent="center" alignItems="center">
												<CircularProgress variant="indeterminate" color="secondary" size="6rem" thickness={4} />
											</Box>
										) : (
											<Stack direction="column" spacing={4}>
												{reviews?.map((review) => (
													<Paper key={review._id} variant="outlined" sx={{ padding: 4 }}>
														<Stack spacing={2}>
															<Typography variant="h5" component="h5">
																{review.user.name}
															</Typography>
															<Rating name={`${review._id}_rating`} size="large" value={review.rating || 0} precision={0.1} readOnly />
															<Typography variant="h6" component="h6">
																{review.createdAt.substring(0, 10)}
															</Typography>
															<Typography variant="body1" component="p">
																{review.comment}
															</Typography>
														</Stack>
													</Paper>
												))}
											</Stack>
										)}
									</Grid>
								)}

								<Grid item xs={12}>
									{userInfo ? (
										<Paper variant="outlined" sx={{ padding: 4 }}>
											<Box marginBottom={4}>
												<Typography variant="h4" component="h4" fontWeight={700}>
													Write A Review
												</Typography>
											</Box>
											<Stack spacing={2}>
												<Stack direction="row" alignItems="center" spacing={2}>
													<Typography variant="h5" component="h5">
														Rating:
													</Typography>
													<Rating
														name={`${product._id}_rating`}
														size="large"
														value={rating}
														precision={0.25}
														onChange={(e, newValue) => setRating(newValue)}
													/>
												</Stack>
												<TextField
													id="outlined-multiline-flexible"
													label="Comment"
													multiline
													maxRows={4}
													value={comment}
													onChange={(event) => setComment(event.target.value)}
												/>
												<Button variant="contained" size="large" disabled={createReviewLoading} onClick={createReviewHandler}>
													{createReviewLoading ? <CircularProgress color="secondary" size="2rem" thickness={4} /> : 'Submit'}
												</Button>
											</Stack>
										</Paper>
									) : (
										<Alert severity="info">
											Please{' '}
											<Link component={RouterLink} to="/login">
												Login
											</Link>{' '}
											To Write A review.
										</Alert>
									)}
								</Grid>
							</Grid>
						</>
					)}
				</Container>
			</Box>
		</>
	);
};

export default ProductDetails;