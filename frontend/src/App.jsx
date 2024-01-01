import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import Root from './pages/Root';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
		</Route>
	)
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;