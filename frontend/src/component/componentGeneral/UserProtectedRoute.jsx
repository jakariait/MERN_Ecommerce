import { Navigate, Outlet } from 'react-router-dom';
import useAuthUserStore from '../../store/AuthUserStore.js';

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const UserProtectedRoute = () => {
  const { token } = useAuthUserStore();

  if (!token) return <Navigate to="/login" replace />;
  if (isTokenExpired(token)) {
    localStorage.removeItem('user_token');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default UserProtectedRoute;
