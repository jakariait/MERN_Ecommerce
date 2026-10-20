import { useEffect, useState } from 'react';
import useAuthUserStore from '../../store/AuthUserStore.js';
import useOrderSummaryStore from '../../store/OrderSummaryStore.js';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import {
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const TableSkeleton = () => (
  <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
    <div className="border-b border-border/50 px-4 h-[45px] flex items-center">
      <Skeleton className="inline-block h-3 w-2/5" />
    </div>
    {Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="flex items-center justify-between px-4 h-[61px] border-b border-border/30"
      >
        <Skeleton className="inline-block h-3.5 w-24" />
        <Skeleton className="inline-block h-3.5 w-24" />
        <Skeleton className="inline-block h-3.5 w-20" />
        <Skeleton className="inline-block h-3.5 w-8" />
        <Skeleton className="inline-block h-3.5 w-16" />
        <Skeleton className="inline-block h-7 w-20" />
      </div>
    ))}
    <div className="px-4 h-[57px] flex items-center justify-between">
      <Skeleton className="inline-block h-3 w-16" />
      <Skeleton className="inline-block h-8 w-48" />
    </div>
  </div>
);

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  processing: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20',
  approved: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
  shipped: 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20',
  delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
  returned: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20',
};

const AllOrders = () => {
  const { user, token } = useAuthUserStore();
  const { summaries, loading, fetchSummaries } = useOrderSummaryStore();

  const orders = summaries?.orders || [];
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    fetchSummaries({ userId: user?._id, token });
  }, [user?._id, token, fetchSummaries]);

  // Only "initial" loading — when cached data already exists, never flash
  // the skeleton back in (keeps the table height stable).
  const initialLoading = loading || !summaries;

  const totalPages = Math.ceil(orders.length / rowsPerPage) || 1;
  const paginated = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {initialLoading
              ? 'Loading...'
              : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {initialLoading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-xl border border-dashed border-muted-foreground/20">
          <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-muted/50">
            <ShoppingBag className="size-6 text-muted-foreground/50" />
          </div>
          <p className="text-base font-medium mb-1">No orders yet</p>
          <p className="text-sm text-muted-foreground/70 mb-6 text-center max-w-xs">
            When you place an order, you&apos;ll find it here.
          </p>
          <Button onClick={() => navigate('/shop')} size="sm">
            <ShoppingBag className="size-3.5 mr-2" />
            Browse products
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Order
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Date
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Status
                  </th>
                  <th className="text-right px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Items
                  </th>
                  <th className="text-right px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Total
                  </th>
                  <th className="text-center px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paginated.map((order) => {
                  const qty =
                    order.totalQuantity ??
                    order.items?.reduce((s, i) => s + i.quantity, 0);
                  const date = new Date(order.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  );
                  const cls =
                    statusStyles[order.orderStatus] ||
                    'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';

                  return (
                    <tr
                      key={order._id}
                      className="group hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium">
                          {order.orderNo}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">
                        {date}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-right tabular-nums text-muted-foreground">
                        {qty}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-right font-medium tabular-nums">
                        ৳{order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/user/orders/${order.orderNo}`)
                          }
                        >
                          <Eye className="size-3.5 mr-1.5" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="size-8 p-0"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`size-8 rounded-md text-xs font-medium transition-colors ${
                      i === page
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="size-8 p-0"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
