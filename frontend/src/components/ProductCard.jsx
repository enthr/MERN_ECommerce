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

import { SERVER } from '../lib/constants';

const Product = ({ product }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const imageSrc = (product.image.includes('images')) ? `${SERVER}/uploads${product.image}` : `${SERVER}/${product.image}`;

	return (
		<Link component={RouterLink} to={`/product/${product._id}`} color="inherit" underline="none">
			<Card variant="elevation" raised={true}>
				<CardMedia component="img" image={imageSrc} alt={product.name} height="300px" />
				<CardContent sx={{ marginX: 3, marginY: 2 }}>
					<Typography noWrap={(isMobile) ? false : true} variant="h5" component="h5" fontWeight="500">
						{product.name}
					</Typography>
					<Stack direction="row" alignItems="center" spacing={1} marginY={2}>
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