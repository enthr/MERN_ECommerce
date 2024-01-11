import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Meta from '../components/Meta';
import { useUpdateProductByIdMutation, useGetProductByIdQuery, useUploadProductImageMutation } from '../services/productApi';
import { useGetAllCategoriesQuery } from '../services/categoryApi';
import { SERVER } from '../lib/constants';

const ProductEdit = () => {
	const { productId } = useParams();

	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [productImage, setProductImage] = useState('');
	const [productBrand, setProductBrand] = useState('');
	const [productCategory, setProductCategory] = useState('');
	const [productCountInStock, setProductCountInStock] = useState('');
	const [productDescription, setProductDescription] = useState('');
	const [imageSrc, setImageSrc] = useState('');

	const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(productId);
	const product = productData?.product;

	const { data: categoryData, isLoading: categoryLoading } = useGetAllCategoriesQuery();
	const categories = categoryData?.category;

	const [updateProductById, { isLoading: updateProductLoading, error }] = useUpdateProductByIdMutation();

	const [uploadProductImage, { isLoading: uploadProductImageLoading, error: uploadProductImageError }] = useUploadProductImageMutation();

	const fileUploadHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);

		try {
			const res = await uploadProductImage(formData).unwrap();

			if (res.success) {
				setProductImage(res.image);
				toast.success('Image Uploaded Successfully.');
			} else {
				toast.error(uploadProductImageError.message || 'Something Went Wrong.');
			}
		} catch (err) {
			toast.error(err?.data?.message || 'Something Went Wrong.');
		}
	};

	const updateProductHandler = async (e) => {
		e.preventDefault();

		if (!productName || !productPrice || !productImage || !productBrand || !productCategory || !productCountInStock || !productDescription) {
			toast.error('Please Fill In All Fields.');
			return;
		}

		try {
			const res = await updateProductById({
				_id: productId,
				name: productName,
				price: productPrice,
				image: productImage,
				brand: productBrand,
				category: productCategory,
				countInStock: productCountInStock,
				description: productDescription
			}).unwrap();

			if (res.success) {
				toast.success('Product Updated Successfully.');
			} else {
				toast.error(error.message || 'Something Went Wrong.');
			}
		} catch (err) {
			toast.error(err?.data?.message || 'Something Went Wrong.');
		}
	};

	useEffect(() => {
		if (product) {
			setProductName(product.name);
			setProductPrice(product.price);
			setProductImage(product.image);
			setProductBrand(product.brand);
			setProductCategory(product.category._id);
			setProductCountInStock(product.countInStock);
			setProductDescription(product.description);
		}
	}, [product]);

	useEffect(() => {
		if (productImage.includes('images')) {
			setImageSrc(`${SERVER}/uploads${productImage}`);
		} else {
			setImageSrc(`${SERVER}/${productImage}`);
		}
	}, [productImage]);

	return (
		<>
            <Meta title="Edit Product | SHOP" description="Edit Product Page of The SHOP For Admin." />
			<Box component="main" marginY={{ xs: 4, lg: 14 }} minHeight="75vh">
				<Container maxWidth="3xl">
					<Box marginBottom={4} width={{ xs: '100%', lg: '50%' }} marginX="auto">
						<Link component={RouterLink} to="/admin/products">
							<Button variant="contained" size="large" startIcon={<ArrowBackIcon />}>
								Go Back
							</Button>
						</Link>
					</Box>
					<Paper variant="outlined" sx={{ width: { xs: '100%', lg: '50%' }, marginX: 'auto' }}>
						<Stack spacing={6} padding={{ xs: 4, lg: 8 }}>
							<Typography color="primary" variant="h3" component="h3" align="center" fontWeight={700} width="100%">
								Edit Product
							</Typography>
							<TextField
								fullWidth={true}
								required={true}
								id="product-name"
								label="Product Name"
								variant="outlined"
								margin="normal"
								type="text"
								value={productName || ''}
								onChange={(e) => setProductName(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="product-price"
								label="Product Price"
								variant="outlined"
								margin="normal"
								type="number"
								value={productPrice || 0}
								onChange={(e) => setProductPrice(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="product-brand"
								label="Product Brand"
								variant="outlined"
								margin="normal"
								type="text"
								value={productBrand || ''}
								onChange={(e) => setProductBrand(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="product-count-in-stock"
								label="Product Count In Stock"
								variant="outlined"
								margin="normal"
								type="number"
								value={productCountInStock || 0}
								onChange={(e) => setProductCountInStock(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="product-description"
								label="Product Description"
								variant="outlined"
								margin="normal"
								type="text"
								multiline={true}
								value={productDescription || ''}
								onChange={(e) => setProductDescription(e.target.value)}
							/>
							<FormControl>
								<FormLabel id="category-group-label">Select Category</FormLabel>
								<RadioGroup
									aria-labelledby="payment-group-label"
									value={productCategory || ''}
									onChange={(e) => setProductCategory(e.target.value)}
									name="category-group"
								>
									{categories?.map((category) => (
										<FormControlLabel key={category._id} value={category._id} control={<Radio size="medium" />} label={category.name} />
									))}
								</RadioGroup>
							</FormControl>
							<Stack direction="row" spacing={2}>
								<label htmlFor="upload-image">
									<Button variant="contained" size="large" component="span" sx={{ paddingX: 4, height: '100%' }}>
										Upload
									</Button>
									<input id="upload-image" hidden accept="image/*" type="file" onChange={fileUploadHandler} />
								</label>
								<TextField
									fullWidth={true}
									disabled={true}
									id="product-image"
									label="Product Image"
									variant="outlined"
									margin="normal"
									type="text"
									value={productImage || ''}
								/>
							</Stack>
							{productImage && (
								<Paper>
									<img src={imageSrc} alt="Uploaded Image" width="100%" height="300px" />
								</Paper>
							)}
							{productLoading || updateProductLoading || categoryLoading || uploadProductImageLoading ? (
								<CircularProgress color="secondary" thickness={4} size="4rem" />
							) : (
								<Button variant="contained" size="large" onClick={updateProductHandler} sx={{ width: '100%', paddingY: 1.5 }}>
									Update Product
								</Button>
							)}
						</Stack>
					</Paper>
				</Container>
			</Box>
		</>
	);
};

export default ProductEdit;