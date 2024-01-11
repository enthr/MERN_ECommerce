import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AdbIcon from '@mui/icons-material/Adb';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';

import { changeTheme } from '../features/theme/themeSlice';
import { clearUserInfo } from '../features/auth/authSlice';
import { resetCart } from '../features/cart/cartSlice';
import { useLogoutMutation } from '../services/userApi';

const Header = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.cartItems);
	const userInfo = useSelector((state) => state.auth.userInfo);
	const darkMode = useSelector((state) => state.theme.darkMode);

	const [logout] = useLogoutMutation();

	const toggleDarkMode = () => {
		dispatch(changeTheme());
	};

	const logoutHandler = async () => {
		try {
			await logout().unwrap();
			dispatch(clearUserInfo());
            dispatch(resetCart());
			toast.success('Logged Out Successfully.');
			navigate('/login');
		} catch (error) {
			toast.error(error?.data?.message || 'Something Went Wrong.');
		}
	};

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
					<Stack direction="row" spacing={1} alignItems="center">
						<Tooltip title="Toggle Theme">
							<IconButton aria-label="Toggle Theme" size="large" sx={{ color: 'white' }} onClick={toggleDarkMode}>
								{darkMode ? <LightModeIcon /> : <DarkModeIcon />}
							</IconButton>
						</Tooltip>
						<Link component={RouterLink} to="/cart">
							<Tooltip title="Cart">
								<IconButton aria-label="Cart" size="large" sx={{ color: 'white' }}>
									<Badge badgeContent={cartItems?.length || 0} showZero={true} color="secondary">
										<ShoppingCartIcon />
									</Badge>
								</IconButton>
							</Tooltip>
						</Link>
						{userInfo ? (
							<Tooltip title="Menu">
								<IconButton
									id="shop-button"
									aria-controls={open ? 'shop-menu' : undefined}
									aria-haspopup="true"
									aria-expanded={open ? 'true' : undefined}
									onClick={handleMenuOpen}
									size="large"
									sx={{ color: 'white' }}
								>
									<MenuIcon />
								</IconButton>
							</Tooltip>
						) : (
							<Link component={RouterLink} to="/login">
								<Tooltip title="Login">
									<IconButton aria-label="Login" size="large" sx={{ color: 'white' }}>
										<LoginIcon />
									</IconButton>
								</Tooltip>
							</Link>
						)}

						<Menu
							id="shop-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleMenuClose}
							MenuListProps={{
								'aria-labelledby': 'shop-button'
							}}
						>
							<MenuItem
								onClick={(e) => {
									handleMenuClose(e);
									navigate('/profile');
								}}
							>
								<ListItemIcon>
									<AccountCircleIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText>{userInfo?.name}</ListItemText>
							</MenuItem>
							{userInfo && userInfo?.role === 1 ? (
								<Box>
									<MenuItem
										onClick={(e) => {
											handleMenuClose(e);
											navigate('/admin/users');
										}}
									>
										<ListItemIcon>
											<PeopleIcon fontSize="small" />
										</ListItemIcon>
										<ListItemText>Users</ListItemText>
									</MenuItem>
									<MenuItem
										onClick={(e) => {
											handleMenuClose(e);
											navigate('/admin/categories');
										}}
									>
										<ListItemIcon>
											<CategoryIcon fontSize="small" />
										</ListItemIcon>
										<ListItemText>Categories</ListItemText>
									</MenuItem>
									<MenuItem
										onClick={(e) => {
											handleMenuClose(e);
											navigate('/admin/orders');
										}}
									>
										<ListItemIcon>
											<ShoppingBagIcon fontSize="small" />
										</ListItemIcon>
										<ListItemText>Orders</ListItemText>
									</MenuItem>
                                    <MenuItem
										onClick={(e) => {
											handleMenuClose(e);
											navigate('/admin/products');
										}}
									>
										<ListItemIcon>
											<InventoryIcon fontSize="small" />
										</ListItemIcon>
										<ListItemText>Products</ListItemText>
									</MenuItem>
								</Box>
							) : (
								null
							)}
							<MenuItem
								onClick={(e) => {
									handleMenuClose(e);
									logoutHandler();
								}}
							>
								<ListItemIcon>
									<LogoutIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText>Logout</ListItemText>
							</MenuItem>
						</Menu>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;