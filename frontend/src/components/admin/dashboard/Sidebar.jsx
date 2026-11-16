import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Menu,
  X,
  ShoppingCart,
  Package,
  Users,
  Box,
  CreditCard,
  BarChart3,
  Megaphone,
  MessageSquareQuote,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Drawer } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutGrid,
    path: '/admin/dashboard',
    badge: 'pendingOrders',
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    path: '/admin/manage-orders',
    badge: 'totalOrders',
  },
  {
    label: 'Products',
    icon: Package,
    path: '/admin/manage-products',
  },
  {
    label: 'Categories',
    icon: Box,
    path: '/admin/category',
  },
  {
    label: 'Customers',
    icon: Users,
    path: '/admin/customers',
  },
  {
    label: 'Inventory',
    icon: Package,
    path: '/admin/inventory',
  },
  {
    label: 'Coupons / Discounts',
    icon: CreditCard,
    path: '/admin/coupon',
  },
  {
    label: 'Reports',
    icon: BarChart3,
    path: '/admin/reports',
  },
  {
    label: 'Marketing',
    icon: Megaphone,
    path: '/admin/marketing',
  },
  {
    label: 'Reviews',
    icon: MessageSquareQuote,
    path: '/admin/reviews',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings',
  },
];

const SIDEBAR_WIDTH = 'w-72';
const SIDEBAR_COLLAPSED_WIDTH = 'w-20';

export function Sidebar({ counts = {}, className }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setCollapsed(false);
    const onChange = () => setDrawerOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleDrawer = useCallback(() => setDrawerOpen((o) => !o), []);

  const badgeFor = (item) => {
    if (!item.badge) return null;
    const value = counts[item.badge] ?? 0;
    return value > 0 ? <Badge variant="outline">{value}</Badge> : null;
  };

  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full border-r bg-background transition-all duration-300 overflow-hidden flex flex-col',
          collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          className,
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          {!collapsed && (
            <h2 className="font-bold tracking-tight text-lg">Admin Panel</h2>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md p-1.5 hover:bg-accent text-muted-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronDown className="size-5 rotate-180" />
            ) : (
              <X className="size-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setDrawerOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <div className="flex size-7 items-center justify-center shrink-0">
                  <Icon className="size-4" />
                </div>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && badgeFor(item)}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={navigate.bind(null, '/admin/login')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="size-4" />
            <span className={cn(collapsed ? 'hidden' : 'block')}>Logout</span>
          </button>
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} showCloseButton>
        <div className="p-4">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h2 className="font-bold text-lg">Admin Panel</h2>
          </div>
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={toggleDrawer}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <div className="flex size-7 items-center justify-center shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <span>{item.label}</span>
                  {badgeFor(item)}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => {
                navigate('/admin/login');
                toggleDrawer();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </Drawer>

      {!collapsed && window.innerWidth < 1024 && (
        <button
          onClick={toggleDrawer}
          className="fixed left-4 top-4 z-50 rounded-md p-2 bg-background border shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      )}
    </>
  );
}
