import { useState } from 'react';
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
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';

import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Meta from '../components/Meta';
import { useGetAllProductsQuery, useDeleteProductByIdMutation, useCreateProductMutation } from '../services/productApi';

const Products = () => {
	const navigate = useNavigate();

	const [page, setPage] = useState(1);

	const { data: productData, isLoading, error, refetch } = useGetAllProductsQuery({ page: page });
	const products = productData?.products;

	const [deleteProductById, { isLoading: deleteProductLoading }] = useDeleteProductByIdMutation();
	const [createProduct, { isLoading: createProductLoading }] = useCreateProductMutation();

	const deleteProductHandler = async (productId) => {
		try {
			const res = await deleteProductById(productId).unwrap();

			if (res.success) {
				refetch();
				toast.success('Product Deleted Successfully.');
			} else {
				toast.error(res.message || 'Something Went Wrong.');
			}
		} catch (error) {
			toast.error(error.data.message || 'Something Went Wrong.');
		}
	};

	const createProductHandler = async () => {
		try {
			if (window.confirm('Are You Sure You Want To Create A New Product ?')) {
				const res = await createProduct().unwrap();

				if (res.success) {
					refetch();
					toast.success('Product Created Successfully.');
				} else {
					toast.error(res.message || 'Something Went Wrong.');
				}
			}
		} catch (error) {
			toast.error(error.data.message || 'Something Went Wrong.');
		}
	};

	const paginationHandler = (event, value) => {
		event.preventDefault();
		setPage(value);
		refetch();
	};

	return (
		<>
            <Meta title="Products Management | SHOP" description="Products Management Page of The SHOP For Admin." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Typography variant="h4" component="h4" fontWeight={700} color="primary" textAlign="center">
						Products
					</Typography>
					<Stack direction="row" justifyContent="flex-end" marginY={4}>
						{createProductLoading ? (
							<CircularProgress color="secondary" thickness={6} size="3rem" />
						) : (
							<Button startIcon={<CreateIcon />} variant="contained" size="large" color="primary" onClick={createProductHandler}>
								Create Product
							</Button>
						)}
					</Stack>
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
											CATEGORY
										</TableCell>
										<TableCell align="center" size="medium">
											PRODUCT ID
										</TableCell>
										<TableCell align="center" size="medium">
											NAME
										</TableCell>
										<TableCell align="center" size="medium">
											BRAND
										</TableCell>
										<TableCell align="center" size="medium">
											PRICE
										</TableCell>
										<TableCell align="center" size="medium">
											STOCK
										</TableCell>
										<TableCell align="center" size="medium"></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{products?.map((product) => (
										<TableRow key={product._id}>
											<TableCell align="center">{product?.category?.name}</TableCell>
											<TableCell align="center">{product._id}</TableCell>
											<TableCell align="center">{product.name}</TableCell>
											<TableCell align="center">{product.brand}</TableCell>
											<TableCell align="center">${product.price}</TableCell>
											<TableCell align="center">{product.countInStock}</TableCell>
											<TableCell align="center">
												<Stack direction="row" spacing={1}>
													<Tooltip title="Edit Product">
														<IconButton
															variant="contained"
															size="small"
															color="secondary"
															onClick={() => navigate(`/admin/product/edit/${product._id}`)}
														>
															<EditIcon />
														</IconButton>
													</Tooltip>
													{deleteProductLoading ? (
														<CircularProgress color="secondary" thickness={4} size="2rem" />
													) : (
														<Tooltip title="Delete Product">
															<IconButton variant="contained" size="small" color="error" onClick={() => deleteProductHandler(product._id)}>
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

					<Box display="flex" justifyContent="center" marginY={6}>
						<Pagination count={productData?.pages || 1} page={page} onChange={paginationHandler} color="primary" size="large" />
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Products;