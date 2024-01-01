import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	return (
		<Box component='footer'>
			<Container maxWidth="3xl">
				<Box sx={{ py: 2 }}>
					<Divider />
				</Box>
				<Box sx={{ paddingBottom: 2 }}>
					<Typography variant="body1" textAlign="center">
						SHOP &copy; {currentYear} By Jaimin
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;