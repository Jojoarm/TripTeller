import Loader from '@/components/common/Loader';
import { useAppContext } from '@/context/AppContext';
import { Navigate, Outlet } from 'react-router';

const AuthLayout = () => {
  const { user, isAuthLoading } = useAppContext();

  if (isAuthLoading) return <Loader />;

  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="relative w-full h-screen bg-[url('/assets/images/auth-img.webp')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-white/60 z-0"></div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
