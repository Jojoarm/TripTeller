import Footer from '@/components/user/Footer';
import Navbar from '@/components/user/Navbar';
import { Outlet } from 'react-router';

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-70vh">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
