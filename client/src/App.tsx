import { Navigate, Route, Routes } from 'react-router';
import Home from './pages/user/Home';
import UserLayout from './layouts/UserLayout';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import { Toaster } from 'react-hot-toast';
import Trips from './pages/user/Trips';

const App = () => {
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = true; // replace with real auth logic

    return isAuthenticated ? children : <Navigate to="/sign-in" />;
  };
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
        </Route>

        {/* Admin Routes */}
        {/* <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
