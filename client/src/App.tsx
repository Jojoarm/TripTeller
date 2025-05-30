import { Route, Routes } from 'react-router';
import Navbar from './components/user/Navbar';
import Home from './pages/user/Home';
import Footer from './components/user/Footer';

const App = () => {
  return (
    <div>
      {/* User */}
      <Navbar />
      <div className="min-h-70vh ">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
