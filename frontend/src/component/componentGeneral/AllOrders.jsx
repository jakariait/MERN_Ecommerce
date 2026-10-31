import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthUserStore from '../../store/AuthUserStore.js';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  ShoppingBag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [5, 8, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

const STATUS_META = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  approved: {
    label: 'Approved',
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    dot: 'bg-indigo-500',
  },
  intransit: {
    label: 'In transit',
    className: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    dot: 'bg-violet-500',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  returned: {
    label: 'Returned',
    className: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    dot: 'bg-orange-500',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dot: 'bg-rose-500',
  },
};

const FALLBACK_STATUS_META = {
  label: 'Unknown',
  className: 'bg-gray-50 text-gray-700 ring-gray-600/20',
  dot: 'bg-gray-400',
};

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'intransit', label: 'In transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' },
  { value: 'cancelled', label: 'Cancelled' },
];

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getStatusMeta = (status) => {
  if (!status) return FALLBACK_STATUS_META;
  const meta = Object.hasOwn(STATUS_META, status) ? STATUS_META[status] : null;
  if (meta) return meta;
  return {
    ...FALLBACK_STATUS_META,
    label: String(status)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  };
};

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '৳0.00';
  return `৳${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatOrderDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getItemCount = (order) => {
  if (!Array.isArray(order?.items)) return 0;
  return order.items.reduce((sum, item) => {
    const quantity = Number(item?.quantity);
    return sum + (Number.isFinite(quantity) ? quantity : 0);
  }, 0);
};

const matchesSearch = (order, term) => {
  if (!term) return true;
  const query = term.toLowerCase();
  const itemNames = Array.isArray(order?.items)
    ? order.items.map(
        (item) => item?.name || item?.productName || item?.productId?.name,
      )
    : [];
  const fields = [
    order?.orderNo,
    order?.orderStatus,
    getStatusMeta(order?.orderStatus).label,
    order?.shippingInfo?.fullName,
    order?.shippingInfo?.mobileNo,
    ...itemNames,
  ];
  return fields
    .filter((value) => value !== undefined && value !== null && value !== '')
    .some((value) => String(value).toLowerCase().includes(query));
};

const matchesStatus = (order, status) =>
  !status || order?.orderStatus === status;

const getPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const pages = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);
  if (left > 2) pages.push('ellipsis');
  for (let pageNumber = left; pageNumber <= right; pageNumber += 1) {
    pages.push(pageNumber);
  }
  if (right < totalPages - 1) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
};

const AllOrders = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, token, loading: authLoading } = useAuthUserStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = user?._id;
  const isAuthenticated = Boolean(userId && token);

  const rawStatus = searchParams.get('status') || '';
  const status = Object.hasOwn(STATUS_META, rawStatus) ? rawStatus : '';
  const search = (searchParams.get('search') || '').trim();
  const page = parsePositiveInt(searchParams.get('page'), 1);
  const rawLimit = parsePositiveInt(
    searchParams.get('limit'),
    DEFAULT_PAGE_SIZE,
  );
  const rowsPerPage = PAGE_SIZE_OPTIONS.includes(rawLimit)
    ? rawLimit
    : DEFAULT_PAGE_SIZE;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      setError(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get(`${apiUrl}/ordersbyUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (data?.success) {
          const list = Array.isArray(data.orders) ? data.orders : [];
          setOrders(list.filter((order) => order && typeof order === 'object'));
        } else {
          setOrders([]);
          setError(data?.message || 'Could not load your orders.');
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return;

        // The API returns 404 when the user has no orders yet. Treat it as an
        // empty result rather than an error.
        if (err?.response?.status === 404) {
          setOrders([]);
          return;
        }

        setOrders([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Something went wrong while loading your orders. Please try again.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [apiUrl, isAuthenticated, reloadKey, token, userId]);

  const updateParams = useCallback(
    (updates, options) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });
        return next;
      }, options);
    },
    [setSearchParams],
  );

  const commitSearch = () => {
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const clearSearch = () => {
    setSearchInput('');
    updateParams({ search: '', page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    updateParams({ search: '', status: '', page: 1 });
  };

  const handleStatusChange = (nextStatus) => {
    updateParams({ status: nextStatus, page: 1 });
  };

  const handlePageSizeChange = (value) => {
    updateParams({ limit: value, page: 1 });
  };

  const retry = () => {
    setReloadKey((key) => key + 1);
  };

  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    orders.forEach((order) => {
      const orderStatus = order?.orderStatus;
      if (!orderStatus) return;
      counts[orderStatus] = (counts[orderStatus] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) => matchesStatus(order, status) && matchesSearch(order, search),
      ),
    [orders, search, status],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginated = filteredOrders.slice(pageStart, pageStart + rowsPerPage);
  const startEntry = filteredOrders.length > 0 ? pageStart + 1 : 0;
  const endEntry = Math.min(pageStart + rowsPerPage, filteredOrders.length);

  useEffect(() => {
    if (loading || error) return;
    if (page > totalPages) {
      updateParams(
        { page: totalPages > 1 ? totalPages : '' },
        { replace: true },
      );
    }
  }, [error, loading, page, totalPages, updateParams]);

  const hasActiveFilters = Boolean(search || status);
  const hasOrders = orders.length > 0;
  const isBusy = loading || authLoading;
  const showControls = !error && hasOrders && !authLoading;
  const showLoader = isBusy && !hasOrders;

  const summary = (() => {
    if (showLoader) return 'Loading...';
    if (error) return 'Unable to load orders';
    if (!isAuthenticated) return 'Sign in to view your orders';
    if (hasActiveFilters) {
      return `${filteredOrders.length} of ${orders.length} order${
        orders.length === 1 ? '' : 's'
      } match your filters`;
    }
    return `${orders.length} order${orders.length === 1 ? '' : 's'}`;
  })();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{summary}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && !showLoader && !error && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Clear filters</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            disabled={isBusy || !isAuthenticated}
            aria-label="Refresh orders"
          >
            <RefreshCw className={`size-3.5 ${isBusy ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {showControls && (
        <>
          <div className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-border/60 px-1 pb-2">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.value;
              const count =
                (tab.value ? statusCounts[tab.value] : statusCounts.all) || 0;
              return (
                <button
                  key={tab.value || 'all'}
                  type="button"
                  onClick={() => handleStatusChange(tab.value)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                      active
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search order no, name or phone..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitSearch();
                    }
                    if (event.key === 'Escape') clearSearch();
                  }}
                  className="bg-background pl-9 pr-9"
                  aria-label="Search orders"
                />
                {searchInput && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                className="h-9 shrink-0"
                onClick={commitSearch}
                disabled={!searchInput.trim()}
              >
                <Search className="size-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger
                    className="h-8 w-16 bg-background"
                    aria-label="Orders per page"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
              <p className="text-xs text-muted-foreground tabular-nums sm:hidden">
                {startEntry}–{endEntry} of {filteredOrders.length}
              </p>
            </div>
          </div>
        </>
      )}

      {showLoader ? (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
          <div className="space-y-2 p-4">
            <Skeleton className="h-9 w-full" />
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : !isAuthenticated ? (
        <Alert severity="warning">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">You are not signed in</p>
              <p className="mt-0.5 text-sm opacity-90">
                Sign in to view your order history.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/login')}
              className="shrink-0"
            >
              Sign in
            </Button>
          </div>
        </Alert>
      ) : error ? (
        <Alert severity="error">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Could not load your orders</p>
              <p className="mt-0.5 text-sm opacity-90">{error}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={retry}
              className="shrink-0"
            >
              <RotateCcw className="size-3.5" />
              Try again
            </Button>
          </div>
        </Alert>
      ) : !hasOrders ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 py-32">
          <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-muted/50">
            <ShoppingBag className="size-6 text-muted-foreground/50" />
          </div>
          <p className="mb-1 text-base font-medium">No orders yet</p>
          <p className="mb-6 max-w-xs text-center text-sm text-muted-foreground/70">
            When you place an order, you&apos;ll find it here.
          </p>
          <Button onClick={() => navigate('/shop')} size="sm">
            <ShoppingBag className="size-3.5" />
            Browse products
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Order
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Date
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Items
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Total
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex size-11 items-center justify-center rounded-full bg-muted/50">
                          <Search className="size-5 text-muted-foreground/50" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            No matching orders
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Try a different search term or clear your filters.
                          </p>
                        </div>
                        {hasActiveFilters && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={clearFilters}
                          >
                            <RotateCcw className="size-3.5" />
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((order, index) => {
                    const statusMeta = getStatusMeta(order?.orderStatus);
                    const quantity = getItemCount(order);
                    const orderNo = order?.orderNo || '—';
                    const canView = Boolean(order?.orderNo);
                    return (
                      <tr
                        key={order?._id || order?.orderNo || `order-${index}`}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium tabular-nums">
                            {orderNo}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                          {formatOrderDate(
                            order?.createdAt || order?.orderDate,
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusMeta.className}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${statusMeta.dot}`}
                              aria-hidden="true"
                            />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm tabular-nums text-muted-foreground">
                          {quantity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-medium tabular-nums">
                          {formatCurrency(order?.totalAmount)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/user/orders/${order.orderNo}`)
                            }
                            disabled={!canView}
                            aria-label={
                              canView
                                ? `View order ${order.orderNo}`
                                : 'Order number unavailable'
                            }
                          >
                            <Eye className="size-3.5" />
                            Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground tabular-nums">
                  {startEntry}–{endEntry}
                </span>{' '}
                of{' '}
                <span className="font-medium text-foreground tabular-nums">
                  {filteredOrders.length}
                </span>{' '}
                order{filteredOrders.length === 1 ? '' : 's'}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      updateParams({ page: Math.max(1, currentPage - 1) })
                    }
                    className="size-8 p-0"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-3.5" />
                  </Button>
                  {getPageItems(currentPage, totalPages).map((item, index) =>
                    item === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-xs text-muted-foreground"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => updateParams({ page: item })}
                        aria-label={`Go to page ${item}`}
                        aria-current={item === currentPage ? 'page' : undefined}
                        className={`size-8 rounded-md text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          item === currentPage
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      updateParams({
                        page: Math.min(totalPages, currentPage + 1),
                      })
                    }
                    className="size-8 p-0"
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
