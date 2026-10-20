import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthUserStore from '../../store/AuthUserStore.js';
import useOrderSummaryStore from '../../store/OrderSummaryStore.js';
import { Button } from '@/components/ui/button';
import Skeleton from 'react-loading-skeleton';
import { Package, Eye, ShoppingBag } from 'lucide-react';

const RecentTableSkeleton = () => (
  <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
    <div className="border-b border-border/50 px-4 h-[41px] flex items-center">
      <Skeleton className="inline-block h-3 w-2/5" />
    </div>
    {Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        className="flex items-center justify-between px-4 h-[57px] border-b border-border/30"
      >
        <Skeleton className="inline-block h-3.5 w-24" />
        <Skeleton className="inline-block h-3.5 w-24" />
        <Skeleton className="inline-block h-3.5 w-20" />
        <Skeleton className="inline-block h-3.5 w-8" />
        <Skeleton className="inline-block h-3.5 w-16" />
        <Skeleton className="inline-block h-7 w-20" />
      </div>
    ))}
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

const RecentOrders = () => {
  const { user, token } = useAuthUserStore();
  const { summaries, loading, fetchSummaries } = useOrderSummaryStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    fetchSummaries({ userId: user._id, token });
  }, [user?._id, token, fetchSummaries]);

  const orders = (summaries?.orders || []).slice(0, 10);
  const initialLoading = loading || !summaries;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Package className="size-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Recent Orders
            </h2>
            <p className="text-sm text-muted-foreground">
              {initialLoading
                ? 'Loading...'
                : `Last ${orders.length} order${orders.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        {orders.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/user/orders')}
          >
            View all
          </Button>
        )}
      </div>

      {initialLoading ? (
        <RecentTableSkeleton />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-muted-foreground/20">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted/50">
            <ShoppingBag className="size-5 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium mb-1">No orders yet</p>
          <p className="text-xs text-muted-foreground/70 mb-5 text-center max-w-xs">
            When you place an order, it will show up here.
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
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Items
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Total
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {orders.map((order) => {
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
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">
                          {order.orderNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {date}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right tabular-nums text-muted-foreground">
                        {qty}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">
                        ৳{order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
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
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
