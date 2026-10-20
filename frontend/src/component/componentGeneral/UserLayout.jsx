import { useRef, useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from './Layout.jsx';
import UserMenu from './UserMenu.jsx';
import { FaUser } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { preloadUserRoutes } from '../../utils/routePreloader.js';

// Heights of this fallback must match the real page it reserves,
// so the document height (and scrollbar) never moves on load.
const OrdersFallback = () => (
  <div className="space-y-5">
    <div>
      <div className="h-7 w-24 bg-muted rounded" />
      <div className="h-5 mt-1 w-20 bg-muted/70 rounded" />
    </div>
    <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <div className="border-b border-border/50 px-4 h-[45px]" />
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="border-b border-border/30 h-[61px]"
        />
      ))}
      <div className="px-4 h-[57px]" />
    </div>
  </div>
);

const HomeFallback = () => (
  <div>
    <div className="pt-5 pb-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-[94px] rounded-xl border border-border/60 bg-card"
        />
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-12 flex items-center justify-between">
        <div className="h-9 w-40 bg-muted rounded" />
        <div className="h-8 w-28 bg-muted rounded" />
      </div>
      <div className="h-[612px] rounded-xl border border-border/60 bg-card" />
    </div>
  </div>
);

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    preloadUserRoutes();
  }, []);

  return (
    <Layout>
      <div className={'xl:container xl:mx-auto p-3 flex gap-4 relative'}>
        {/*User Menu*/}
        <div className={'w-[350px] hidden lg:block'}>
          <UserMenu />
        </div>
        {/*User Menu Icon*/}
        <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50 secondaryBgColor accentTextColor p-3 rounded-r-lg cursor-pointer">
          <FaUser
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={'text-2xl'}
          />
        </div>
        {/* Mobile Menu Overlay for User Menu */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
            isMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div
            ref={menuRef}
            className="relative bg-white w-64 h-full shadow-lg transform transition-transform duration-400 ease-in-out"
            style={{
              transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            }}
          >
            <button
              className={
                'absolute z-50 right-5 top-5 bg-white p-2 rounded-full'
              }
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MdClose className={'w-4 h-4'} />
            </button>
            <UserMenu />
          </div>
        </div>
        {/*Children Component Append Here*/}
        <main className="w-full">
          <Suspense
            fallback={
              location.pathname === '/user/home' ? (
                <HomeFallback />
              ) : (
                <OrdersFallback />
              )
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </Layout>
  );
};

export default UserLayout;
