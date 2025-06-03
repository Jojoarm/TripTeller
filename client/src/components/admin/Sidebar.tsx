import { sidebarItems } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router';

const Sidebar = () => {
  const { user } = useAppContext();
  const handleLogout = () => {};
  return (
    <section className="flex flex-col h-full  pt-12 lg:pt-10">
      {/* Logo */}
      <Link
        to="/"
        className="hidden md:block pb-8 px-4 md:px-8 border-b border-light-100"
      >
        <img src="/assets/icons/Logo.png" alt="logo" className="h-10" />
      </Link>

      {/* Mobile Logo */}
      <Link
        to="/"
        className="md:hidden pb-8 px-4 md:px-8 border-b border-light-100"
      >
        <img src="/assets/icons/tripteller.png" alt="logo" className="h-10" />
      </Link>

      <div className="flex flex-col gap-2 h-full md:w-64 w-16 text-lg">
        {sidebarItems.map((item) => (
          <NavLink
            to={item.href}
            key={item.id}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center py-3 px-4 md:px-8 gap-3 ${
                isActive
                  ? 'border-r-4 md:border-r-[6px] bg-blue-600/10 text-blue-600 border-blue-600'
                  : 'hover:bg-blue-400/10 border-white text-gray-700'
              }`
            }
          >
            <img
              src={item.icon}
              alt={item.label}
              className="min-h-6 min-w-6 text-gray-200"
            />
            <p className="hidden md:block text-center">{item.label}</p>
          </NavLink>
        ))}
      </div>

      <footer className="flex pl-4 md:pl-8 items-center gap-3 pb-8">
        <div className="hidden md:flex gap-2">
          <img
            src={user?.image || user?.updatedAt[0].toUpperCase()}
            alt="profile picture"
            className="size-10 rounded-full aspect-square"
            referrerPolicy="no-referrer"
          />
          <article className="mflex flex-col max-w-[115px]">
            <h2 className="text-sm md:text-base font-semibold text-dark-200 truncate">
              {user?.username}
            </h2>
            <p className="text-gray-100 text-xs md:text-sm font-normal truncate">
              {user?.email}
            </p>
          </article>
        </div>

        <LogOut
          onClick={handleLogout}
          className="size-6 cursor-pointer text-gray-500"
        />
      </footer>
    </section>
  );
};

export default Sidebar;
