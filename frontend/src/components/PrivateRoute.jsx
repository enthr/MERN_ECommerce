import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
	const userInfo = useSelector((state) => state.auth.userInfo);

	return <>{userInfo ? <Outlet /> : <Navigate to="/login" replace={true} />}</>;
};

export default PrivateRoute;