import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!user?.es_admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;