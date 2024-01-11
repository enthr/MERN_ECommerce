import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';

import ProductCard from '../components/ProductCard';
import Subheader from '../components/Subheader';
import Carousel from '../components/Carousel';
import Meta from '../components/Meta';
import { useGetAllProductsQuery } from '../services/productApi';

const Home = () => {
    const isMobile = useMediaQuery('(max-width: 799px)');
	const [page, setPage] = useState(1);

	const { data, isLoading, error, isError, refetch } = useGetAllProductsQuery({ page: page });

	const paginationHandler = (event, value) => {
		event.preventDefault();
		setPage(value);
		refetch();
	};

	return (
		<>
            <Meta title="Home | SHOP" description="Home Page of The SHOP." />
			<Subheader />
			<Box component="main" marginTop={4} marginBottom={8}>
				<Container maxWidth="3xl">
                    {isMobile ? (<></>) : (<Carousel />)}                    
					<Typography variant="h2" component="h2" marginY={4} fontWeight={700} fontSize={{ xs: '2rem', sm: '3.75rem' }}>
						Latest Products
					</Typography>
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
							<Grid container columnSpacing={4} rowSpacing={6}>
								{data?.products.map((product) => (
									<Grid item key={product._id} sm={12} md={6} xl={4}>
										<ProductCard product={product} />
									</Grid>
								))}
							</Grid>
							<Box display="flex" justifyContent="center" marginY={6}>
								<Pagination count={data?.pages || 1} page={page} onChange={paginationHandler} color="primary" size="large" />
							</Box>
						</>
					)}
				</Container>
			</Box>
		</>
	);
};

export default Home;