import { Navigate, Route, Routes } from 'react-router';
import Home from './pages/user/Home';
import UserLayout from './layouts/UserLayout';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import { Toaster } from 'react-hot-toast';
import Trips from './pages/user/Trips';
import TripDetails from './pages/user/TripDetails';
import { useAppContext } from './context/AppContext';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CreateTrip from './pages/admin/CreateTrip';
import AllUsers from './pages/admin/AllUsers';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

const App = () => {
  const { user } = useAppContext();
  const isAdmin = user?.status === 'admin';
  // const AdminRoute = ({ children }: { children: React.ReactNode }) => {

  //   return isAdmin ? children : <Navigate to="/sign-in" />;
  // };

  return (
    <div>
      <Toaster />
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
        </Route>

        {/* Admin Routes */}
        {isAdmin && (
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/create-trip" element={<CreateTrip />} />
            <Route path="/admin/all-users" element={<AllUsers />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
