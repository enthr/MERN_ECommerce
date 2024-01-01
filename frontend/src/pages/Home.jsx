import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProductCard from '../components/ProductCard';
import products from '../products';

const Home = () => {
	return (
		<Box component="main" marginY={8}>
			<Container maxWidth="3xl">
				<Typography variant="h2" component="h2" marginY={4} fontWeight={700} fontSize={{ xs: '2rem', sm: '3.75rem' }}>
					Latest Products
				</Typography>
				<Grid container columnSpacing={4} rowSpacing={6}>
					{products.map((product) => (
						<Grid item key={product._id} sm={12} md={6} xl={4}>
							<ProductCard product={product} />
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Home;