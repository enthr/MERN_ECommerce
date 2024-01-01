import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

import AdbIcon from '@mui/icons-material/Adb';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ darkMode, setDarkMode }) => {
	return (
		<AppBar position="static" color="primary" enableColorOnDark={true} component="header">
			<Container maxWidth="3xl">
				<Toolbar disableGutters={true} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Box>
						<Link component={RouterLink} to="/" color="inherit" underline="none">
							<Stack direction="row" spacing={1} alignItems="center">
								<AdbIcon />
								<Typography variant="h6" noWrap={true} component="h6" sx={{ letterSpacing: '0.1rem', fontWeight: 500 }}>
									SHOP
								</Typography>
							</Stack>
						</Link>
					</Box>
					<Box></Box>
					<Stack direction="row" spacing={1} alignItems="center">
						<Tooltip title="Toggle Theme">
							<IconButton aria-label="Toggle Theme" size="large" sx={{ color: 'white' }} onClick={() => setDarkMode(!darkMode)}>
								{darkMode ? <LightModeIcon /> : <DarkModeIcon />}
							</IconButton>
						</Tooltip>
						<Link component={RouterLink} to="/cart">
							<Tooltip title="Cart">
								<IconButton aria-label="Cart" size="large" sx={{ color: 'white' }}>
									<Badge badgeContent={5} color="secondary">
										<ShoppingCartIcon />
									</Badge>
								</IconButton>
							</Tooltip>
						</Link>
						<Link component={RouterLink} to="/login">
							<Tooltip title="Login">
								<IconButton aria-label="Login" size="large" sx={{ color: 'white' }}>
									<AccountCircleIcon />
								</IconButton>
							</Tooltip>
						</Link>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;