import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Meta from '../components/Meta';
import { useUpdateCategoryByIdMutation, useGetCategoryByIdQuery } from '../services/categoryApi';

const CategoryEdit = () => {
	const { categoryId } = useParams();

	const [categoryName, setCategoryName] = useState('');

	const { data: categoryData, isLoading: categoryLoading } = useGetCategoryByIdQuery(categoryId);
	const category = categoryData?.category;

	const [updateCategoryById, { isLoading: updateCategoryLoading, error }] = useUpdateCategoryByIdMutation();

	const updateCategoryHandler = async (e) => {
		e.preventDefault();

		if (!categoryName) {
			toast.error('Please Fill In All Fields.');
			return;
		}

		try {
			const res = await updateCategoryById({ _id: categoryId, name: categoryName }).unwrap();

			if (res.success) {
				toast.success('Category Updated Successfully.');
			} else {
				toast.error(error.message || 'Something Went Wrong.');
			}
		} catch (err) {
			toast.error(err?.data?.message || 'Something Went Wrong.');
		}
	};

	useEffect(() => {
		if (category) {
			setCategoryName(category.name);
		}
	}, [category]);

	return (
		<>
            <Meta title="Edit Category | SHOP" description="Edit Category Page of The SHOP For Admin." />
			<Box component="main" marginY={{ xs: 4, lg: 14 }} minHeight="75vh">
				<Container maxWidth="3xl">
					<Box marginBottom={4} width={{ xs: '100%', lg: '50%' }} marginX="auto">
						<Link component={RouterLink} to="/admin/categories">
							<Button variant="contained" size="large" startIcon={<ArrowBackIcon />}>
								Go Back
							</Button>
						</Link>
					</Box>
					<Paper variant="outlined" sx={{ width: { xs: '100%', lg: '50%' }, marginX: 'auto' }}>
						<Stack spacing={6} padding={{ xs: 4, lg: 8 }} alignItems="center">
							<Typography color="primary" variant="h3" component="h3" align="center" fontWeight={700} width="100%">
								Edit Category
							</Typography>
							<TextField
								fullWidth={true}
								required={true}
								id="category"
								label="Category"
								variant="outlined"
								margin="normal"
								type="text"
								value={categoryName || ''}
								onChange={(e) => setCategoryName(e.target.value)}
							/>
							{categoryLoading || updateCategoryLoading ? (
								<CircularProgress color="secondary" thickness={4} size="4rem" />
							) : (
								<Button variant="contained" size="large" onClick={updateCategoryHandler} sx={{ width: '100%', paddingY: 1.5 }}>
									Update Category
								</Button>
							)}
						</Stack>
					</Paper>
				</Container>
			</Box>
		</>
	);
};

export default CategoryEdit;