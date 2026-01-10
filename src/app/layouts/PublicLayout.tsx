import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/Loading';

export function PublicLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        <Outlet />
      </div>
    </div>
  );
}
