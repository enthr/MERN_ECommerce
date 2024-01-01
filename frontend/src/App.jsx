import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import Root from './pages/Root';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
			<Route index={true} element={<Home />} />
            <Route path="product/:productId" element={<ProductDetails />} />
		</Route>
	)
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;