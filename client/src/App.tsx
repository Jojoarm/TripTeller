import { Navigate, Route, Routes } from 'react-router';
import Home from './pages/user/Home';
import UserLayout from './layouts/UserLayout';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import { Toaster } from 'react-hot-toast';
import Trips from './pages/user/Trips';
import TripDetails from './pages/user/TripDetails';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CreateTrip from './pages/admin/CreateTrip';
import AllUsers from './pages/admin/AllUsers';
import Bookings from './pages/user/Bookings';
import PaymentSuccess from './components/user/PaymentSuccess';
import ForgotPassword from './components/common/ForgotPassword';
import ResetPassword from './components/common/ResetPassword';
import TokenVerification from './components/common/TokenVerification';
import AuthLayout from './layouts/AuthLayout';
import AllTrips from './pages/admin/AllTrips';

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-token" element={<TokenVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/my-bookings" element={<Bookings />} />
          <Route path="/booking/success" element={<PaymentSuccess />} />
          <Route path="/trips/:id" element={<TripDetails />} />
        </Route>

        {/* Admin Routes */}

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/create-trip" element={<CreateTrip />} />
          <Route path="/admin/all-users" element={<AllUsers />} />
          <Route path="/admin/all-trips" element={<AllTrips />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
