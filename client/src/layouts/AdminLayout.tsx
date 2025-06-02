import Sidebar from '@/components/admin/Sidebar';
import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 px-4 md:px-10 h-full bg-light-200 pt-12 lg:pt-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
