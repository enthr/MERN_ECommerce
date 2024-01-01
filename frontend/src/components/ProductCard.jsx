import { Link as RouterLink } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Product = ({ product }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Link component={RouterLink} to={`/product/${product._id}`} color="inherit" underline="none">
			<Card raised={true}>
				<CardMedia component="img" image={product.image} alt={product.name} sx={{ paddingX: 3, paddingTop: 3, paddingBottom: 1 }} />
				<CardContent sx={{ paddingX: 3 }}>
					<Typography noWrap={(isMobile) ? false : true} variant="h5" component="h5" fontSize="1.4rem" fontWeight="500">
						{product.name}
					</Typography>
					<Stack direction="row" alignItems="center" spacing={1} marginY={1}>
						<Rating name={`${product._id}_rating`} size="large" value={product.rating} precision={0.25} readOnly />
                        <Typography variant="h6" component="h6" color="text.secondary" fontWeight={500}>
                            {product.numReviews} Reviews
                        </Typography>
					</Stack>
					<Typography variant="h4" component="h4" fontWeight="700" color="primary.light">
						${product.price}
					</Typography>
				</CardContent>
			</Card>
		</Link>
	);
};

export default Product;