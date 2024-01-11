import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Meta from '../components/Meta';
import Steps from '../components/Steps';
import { saveShippingAddress } from '../features/cart/cartSlice';

const Shipping = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const shippingAddress = useSelector((state) => state.cart.shippingAddress);

	const [address, setAddress] = useState(shippingAddress?.address || '');
	const [city, setCity] = useState(shippingAddress?.city || '');
	const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
	const [country, setCountry] = useState(shippingAddress?.country || '');

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(saveShippingAddress({ address, city, postalCode, country }));
		navigate('/payment-method');
	};

	return (
		<>
            <Meta title="Shipping Address | SHOP" description="Shipping Address Page of The SHOP Checkout Process." />
			<Box component="main" marginY={8}>
				<Container maxWidth="3xl">
					<Box>
						<Steps activeStep={0} />
					</Box>
					<Box width={{ xs: '100%', lg: '50%' }} marginX="auto" marginY={8}>
						<Paper variant="outlined" sx={{ padding: { xs: 4, md: 8 } }}>
							<Stack spacing={{ xs: 4, md: 6 }}>
								<Typography color="primary" variant="h3" component="h3" align="center" fontWeight={700} width="100%">
									Shipping Address
								</Typography>
								<TextField
									fullWidth={true}
									required={true}
									id="address"
									label="Address"
									variant="outlined"
									margin="normal"
									type="text"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
								/>
								<TextField
									fullWidth={true}
									required={true}
									id="city"
									label="City"
									variant="outlined"
									margin="normal"
									type="text"
									value={city}
									onChange={(e) => setCity(e.target.value)}
								/>
								<TextField
									fullWidth={true}
									required={true}
									id="postalCode"
									label="Postal Code"
									variant="outlined"
									margin="normal"
									type="text"
									value={postalCode}
									onChange={(e) => setPostalCode(e.target.value)}
								/>
								<TextField
									fullWidth={true}
									required={true}
									id="country"
									label="Country"
									variant="outlined"
									margin="normal"
									type="text"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
								/>
								<Button variant="contained" size="large" color="primary" startIcon={<NavigateNextIcon />} onClick={submitHandler} sx={{ paddingY: 1.5 }}>
									Continue
								</Button>
							</Stack>
						</Paper>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Shipping;