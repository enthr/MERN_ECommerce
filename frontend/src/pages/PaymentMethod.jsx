import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Meta from '../components/Meta';
import Steps from '../components/Steps';
import { savePaymentMethod } from '../features/cart/cartSlice';

const Payment = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const paymentMethod = useSelector((state) => state.cart.paymentMethod);
	const shippingAddress = useSelector((state) => state.cart.shippingAddress);
	const [payment, setPayment] = useState(paymentMethod || 'CARD');

	const handleChange = (e) => {
		setPayment(e.target.value);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(payment));
		navigate('/placeorder');
	};

	useEffect(() => {
		if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
			navigate('/shipping-address');
		}
	}, [shippingAddress, navigate]);

	return (
		<>
            <Meta title="Select Payment Method | SHOP" description="Payment Method Selection Page of The SHOP Checkout Process." />
			<Box component="main" marginY={8} minHeight="75vh">
				<Container maxWidth="3xl">
					<Box>
						<Steps activeStep={1} />
					</Box>
					<Box width={{ xs: '100%', lg: '40%' }} marginX="auto" marginY={8}>
						<Paper variant="outlined" sx={{ padding: { xs: 4, md: 8 } }}>
							<Stack spacing={{ xs: 4, md: 6 }}>
								<Typography color="primary" variant="h3" component="h3" align="center" fontWeight={700} width="100%">
									Payment Method
								</Typography>
								<FormControl>
									<FormLabel id="payment-group-label">Select Payment Method</FormLabel>
									<RadioGroup aria-labelledby="payment-group-label" value={payment} onChange={handleChange} name="payment-group">
										<FormControlLabel value="CARD" control={<Radio size="medium" />} label="Card" />
										<FormControlLabel value="PAYPAL" control={<Radio size="medium" />} label="Paypal" />
									</RadioGroup>
								</FormControl>
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

export default Payment;