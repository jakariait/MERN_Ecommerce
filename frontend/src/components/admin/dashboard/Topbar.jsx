import { useState } from 'react';
import {
  Search,
  Bell,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Plus,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PERIODS } from './data';

export function Topbar({
  onSearchChange,
  period,
  onPeriodChange,
  notificationCount = 0,
  onAddProduct,
  onNewOrder,
  userName = 'Store Owner',
  onThemeToggle,
  isDark,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <div className="sticky top-0 z-30 flex flex-col gap-1 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3">
        <div className="flex items-center gap-4 flex-1 lg:flex-none lg:w-[420px]">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search orders, products, customers…"
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 lg:ml-auto flex-1 lg:flex-auto lg:justify-end min-w-[260px]">
          <div className="relative ml-2">
            <Select
              value={period}
              onValueChange={onPeriodChange}
              className="w-[130px]"
            >
              <SelectTrigger className="h-9 text-sm px-2">
                <SelectValue placeholder="Today" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <Button
              size="icon-xs"
              onClick={onAddProduct}
              variant="outline"
              aria-label="Add product"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              size="icon-xs"
              onClick={onNewOrder}
              variant="default"
              aria-label="New order"
            >
              New Order <ArrowRight className="ml-1 size-3" />
            </Button>
            <Button
              size="icon-xs"
              onClick={onThemeToggle}
              variant="outline"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon-xs"
                  variant="outline"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 size-2.5 bg-rose-500 rounded-full border border-background"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-64" align="start">
                <div className="flex items-center gap-2 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {notificationCount} new
                  </span>
                </div>
                <div className="p-2 space-y-1">
                  {[
                    'New order #10482 placed',
                    'Low stock: Denim Jacket (L)',
                    'Payment failed: order #10478',
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-lg">
                      <Bell className="size-3.5 mt-0.5 text-muted-foreground" />
                      <p className="leading-tight">{n}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon-xs"
                  variant="outline"
                  className="relative flex items-center gap-2"
                  aria-label="Profile"
                >
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="size-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="end">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-muted-foreground">store@shop.com</p>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-lg">
                    <SettingsIcon className="size-3.5 text-muted-foreground" />
                    <span>Account settings</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-lg text-rose-500">
                    <LogOutIcon className="size-3.5" />
                    <span>Sign out</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogOutIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
