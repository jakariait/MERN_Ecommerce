import { Navigate, Outlet } from 'react-router-dom';
import useAuthAdminStore from '../../store/AuthAdminStore.js';

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = () => {
  const { token } = useAuthAdminStore();

  if (!token) return <Navigate to="/admin/login" replace />;
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
