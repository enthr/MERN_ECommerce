import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useGetTopProductsQuery } from '../services/productApi';
import { SERVER } from '../lib/constants';

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const { data: productsData, isLoading: topProductsLoading, error: topProductsError } = useGetTopProductsQuery();
	const products = productsData?.products;

	const imageSrc = (image) => {
		if (image.includes('images')) {
			return `${SERVER}/uploads${image}`;
		} else {
			return `${SERVER}/${image}`;
		}
	};

	const changeCurrentIndexHandler = (value) => {
		if (value < 0) {
			setCurrentIndex(products.length - 1);
		} else if (value > products.length - 1) {
			setCurrentIndex(0);
		} else {
			setCurrentIndex(value);
		}
	};

	return (
		<Box marginY={12}>
			{topProductsLoading ? (
				<Box width="100%" height="70vh" display="flex" justifyContent="center" alignItems="center">
					<CircularProgress variant="indeterminate" color="secondary" size="6rem" thickness={4} />
				</Box>
			) : topProductsError ? (
				<Box width="100%" height="70vh">
					<Alert variant="filled" severity="error">
						{topProductsError?.data?.message || 'Something Went Wrong! Please Try Again Later.'}
					</Alert>
				</Box>
			) : (
				<Stack direction="row" alignItems="center" spacing={1} width="100%">
					<Box padding={0}>
						<IconButton onClick={() => changeCurrentIndexHandler(currentIndex - 1)} size="large">
							<ChevronLeftIcon />
						</IconButton>
					</Box>
					<Link component={RouterLink} key={products[currentIndex]?._id} to={`/product/${products[currentIndex]?._id}`} underline="none">
						<Card elevation={1}>
							<Stack direction="row" spacing={0}>
								<Box width="50%">
									<CardMedia component="img" width="100%" height="100%" image={imageSrc(products[currentIndex]?.image)} alt={products[currentIndex]?.name} />
								</Box>
								<CardContent sx={{ width: '50%' }}>
									<Stack justifyContent="center" height="100%" spacing={8} padding={4}>
										<Typography variant="h4" component="h4" fontWeight={700}>
											{products[currentIndex]?.brand}
										</Typography>
										<Typography variant="h3" component="h3" color="primary" fontWeight={700}>
											{products[currentIndex]?.name}
										</Typography>
										<Typography variant="h4" component="h4" fontWeight={400}>
											${products[currentIndex]?.price}
										</Typography>
									</Stack>
								</CardContent>
							</Stack>
						</Card>
					</Link>
					<Box padding={0}>
						<IconButton onClick={() => changeCurrentIndexHandler(currentIndex + 1)} size="large">
							<ChevronRightIcon />
						</IconButton>
					</Box>
				</Stack>
			)}
		</Box>
	);
};

export default Carousel;