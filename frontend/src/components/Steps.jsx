import { Link as RouterLink } from 'react-router-dom';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link';

const Steps = ({ activeStep }) => {
	return (
		<Stepper activeStep={activeStep} alternativeLabel>
			<Step>
				<Link component={RouterLink} to="/shipping-address" underline="hover">
					<StepLabel>Enter Shipping Address</StepLabel>
				</Link>
			</Step>
			<Step>
				<Link component={RouterLink} to="/payment-method" underline="hover">
					<StepLabel>Select Payment Method</StepLabel>
				</Link>
			</Step>
			<Step>
				<Link component={RouterLink} to="/placeorder" underline="hover">
					<StepLabel>Place Order</StepLabel>
				</Link>
			</Step>
		</Stepper>
	);
};

export default Steps;