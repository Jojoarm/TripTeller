import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as apiClient from '../../api-client';

const Navbar = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trips', path: '/trips' },
    { name: 'Contact', path: '/' },
    { name: 'About', path: '/' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  //To close user dropdown on clicking the page
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserOpen(false);
      }
    };

    if (isUserOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserOpen]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== '/' ? true : prev));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  //user logout
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: apiClient.logOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
      toast.success('Logged Out!');
      navigate('/');
      scrollTo(0, 0);
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });
  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? 'bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4'
          : 'py-4 md:py-6'
      }`}
    >
      {/* Logo */}
      <Link
        onClick={() => {
          scrollTo({ top: 0, behavior: 'smooth' });
        }}
        to="/"
        className="flex items-center gap-2"
      >
        <img src="/assets/icons/Logo.png" alt="logo" className="h-12" />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => {
              scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? 'bg-gray-700' : 'bg-white'
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
      </div>

      <div className="flex gap-1">
        {user ? (
          <div className="relative " ref={userMenuRef}>
            <div
              onClick={() => setIsUserOpen(!isUserOpen)}
              className="size-8 md:size-12 flex justify-center items-center rounded-full bg-gray-600 overflow-hidden cursor-pointer"
            >
              {user.image ? (
                <img
                  src={`${user?.image}`}
                  alt="profile picture"
                  className=" object-cover "
                  referrerPolicy="no-referrer"
                />
              ) : (
                <p className="text-center text-white font-bold text-2xl">
                  {user.username[0]}
                </p>
              )}
            </div>
            {/* User Menu */}
            {isUserOpen && (
              <div className="absolute top-12 md:top-15 right-0 w-[300px] md:w-[350px] bg-white rounded-2xl shadow shadow-black pb-7">
                <div className="flex border-b border-gray-300 gap-5 p-5">
                  <div className="w-14 flex justify-center items-center  overflow-hidden ">
                    {user.image ? (
                      <img
                        src={`${user.image}`}
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                        className="size-8 md:size-12 rounded-full object-contain m-auto"
                      />
                    ) : (
                      <p className="text-center text-white bg-gray-600 rounded-full px-3 md:px-4 py-1 md:py-1.5 font-bold text-xl md:text-2xl">
                        {user.username[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{user.username}</p>
                    <p className="font-normal">{user.email}</p>
                  </div>
                </div>
                <div className="flex border-b border-gray-300 gap-6 py-3 px-5 hover:bg-slate-100 cursor-pointer">
                  <div className="w-14">
                    <Settings className="size-5 text-gray-700 m-auto" />
                  </div>
                  <p className="flex-1 text-gray-700">Manage Account</p>
                </div>
                {user.status === 'admin' ? (
                  <div
                    onClick={() => {
                      navigate('/admin/dashboard');
                      scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex border-b border-gray-300 gap-6 py-3 px-5 hover:bg-slate-100 cursor-pointer"
                  >
                    <div className="w-14">
                      <LayoutDashboard className="size-5 text-gray-700 m-auto" />
                    </div>
                    <p className="flex-1 text-gray-700">Dashboard</p>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      navigate('/my-bookings');
                      scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex border-b border-gray-300 gap-6 py-3 px-5 hover:bg-slate-100 cursor-pointer"
                  >
                    <div className="w-14">
                      <LayoutDashboard className="size-5 text-gray-700 m-auto" />
                    </div>
                    <p className="flex-1 text-gray-700">My Bookings</p>
                  </div>
                )}
                <div
                  onClick={handleLogout}
                  className="flex border-b border-gray-300 gap-6 py-3 px-5 hover:bg-slate-100 cursor-pointer"
                >
                  <div className="w-14 ">
                    <LogOut className="size-5 text-gray-700 m-auto" />
                  </div>
                  <p className="flex-1 text-gray-700">Sign out</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              navigate('/sign-in');
              scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden md:block bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer"
          >
            Login
          </button>
        )}

        {/* Mobile Menu Button */}

        <div className="flex items-center gap-3 md:hidden">
          <img
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            src="assets/icons/menu.svg"
            className="h-8"
            alt="menu icon"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src="assets/icons/closeIcon.svg"
            alt="close-menu"
            className="h-6.5"
          />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {!user && (
          <button
            onClick={() => {
              navigate('/sign-in');
              scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
