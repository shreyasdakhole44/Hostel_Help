import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ role }) => {
  const { user } = useAuth();

  // not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // wrong role → go to unauthorized page
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // correct role → show the page
  return <Outlet />;
};

export default PrivateRoute;