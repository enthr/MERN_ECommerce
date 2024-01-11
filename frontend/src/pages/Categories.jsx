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

import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Meta from '../components/Meta';
import { useCreateCategoryMutation, useDeleteCategoryByIdMutation, useGetAllCategoriesQuery } from '../services/categoryApi';

const Categories = () => {
	const navigate = useNavigate();

	const { data: categoryData, isLoading, error, refetch } = useGetAllCategoriesQuery();
	const categories = categoryData?.category;

	const [deleteCategoryById, { isLoading: deleteCategoryLoading }] = useDeleteCategoryByIdMutation();
	const [createCategory, { isLoading: createCategoryLoading }] = useCreateCategoryMutation();

	const deleteCategoryHandler = async (categoryId) => {
		try {
			const res = await deleteCategoryById(categoryId).unwrap();

			if (res.success) {
				refetch();
				toast.success('Category Deleted Successfully.');
			} else {
				toast.error(res.message || 'Something Went Wrong.');
			}
		} catch (error) {
			toast.error(error.data.message || 'Something Went Wrong.');
		}
	};

	const createCategoryHandler = async () => {
		try {
			if (window.confirm('Are You Sure You Want To Create A New Category ?')) {
				const res = await createCategory().unwrap();

				if (res.success) {
					refetch();
					toast.success('Category Created Successfully.');
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
            <Meta title="Categories Management | SHOP" description="Categories Management Page of The SHOP For Admin." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Typography variant="h4" component="h4" fontWeight={700} color="primary" textAlign="center">
						Categories
					</Typography>
					<Stack direction="row" justifyContent="flex-end" marginY={4}>
						{createCategoryLoading ? (
							<CircularProgress color="secondary" thickness={6} size="3rem" />
						) : (
							<Button startIcon={<CreateIcon />} variant="contained" size="large" color="primary" onClick={createCategoryHandler}>
								Create Cateogry
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
											CATEGORY ID
										</TableCell>
										<TableCell align="center" size="medium">
											NAME
										</TableCell>
										<TableCell align="center" size="medium">
											ACTIONS
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{categories?.map((category) => (
										<TableRow key={category._id}>
											<TableCell align="center">{category._id}</TableCell>
											<TableCell align="center">{category.name}</TableCell>
											<TableCell align="center">
												<Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
													<Tooltip title="Edit Category">
														<IconButton
															variant="contained"
															size="small"
															color="secondary"
															onClick={() => navigate(`/admin/category/edit/${category._id}`)}
														>
															<EditIcon />
														</IconButton>
													</Tooltip>
													{deleteCategoryLoading ? (
														<CircularProgress color="secondary" thickness={4} size="2rem" />
													) : (
														<Tooltip title="Delete Product">
															<IconButton variant="contained" size="small" color="error" onClick={() => deleteCategoryHandler(category._id)}>
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

export default Categories;