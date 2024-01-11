import { Provider } from 'react-redux';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { HelmetProvider } from 'react-helmet-async';

import store from './lib/store';
import Root from './pages/Root';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ShippingAddress from './pages/ShippingAddress';
import PaymentMethod from './pages/PaymentMethod';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Products from './pages/Products';
import ProductEdit from './pages/ProductEdit';
import Categories from './pages/Categories';
import CategoryEdit from './pages/CategoryEdit';
import Users from './pages/Users';
import UserEdit from './pages/UserEdit';
import Search from './pages/Search';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
			<Route index={true} element={<Home />} />
			<Route path="product/:productId" element={<ProductDetails />} />
			<Route path="cart" element={<Cart />} />
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />
			<Route path="search/" element={<Search />} />
			<Route path="search/:keyword" element={<Search />} />
			<Route path="" element={<PrivateRoute />}>
				<Route path="shipping-address" element={<ShippingAddress />} />
				<Route path="payment-method" element={<PaymentMethod />} />
				<Route path="placeorder" element={<PlaceOrder />} />
				<Route path="order/:orderId" element={<Order />} />
				<Route path="profile" element={<Profile />} />
			</Route>
			<Route path="admin" element={<AdminRoute />}>
				<Route path="orders" element={<Orders />} />
				<Route path="products" element={<Products />} />
				<Route path="product/edit/:productId" element={<ProductEdit />} />
				<Route path="categories" element={<Categories />} />
				<Route path="category/edit/:categoryId" element={<CategoryEdit />} />
				<Route path="users" element={<Users />} />
				<Route path="user/edit/:userId" element={<UserEdit />} />
			</Route>
		</Route>
	)
);

const App = () => {
	return (
		<Provider store={store}>
			<HelmetProvider>
				<PayPalScriptProvider deferLoading={true}>
					<RouterProvider router={router} />
				</PayPalScriptProvider>
			</HelmetProvider>
		</Provider>
	);
};

export default App;