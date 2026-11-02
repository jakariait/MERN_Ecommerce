import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Hourglass,
  CheckCircle,
  Truck,
  CheckCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import useAuthAdminStore from '../../store/AuthAdminStore.js';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Hourglass,
    iconClass:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    iconClass:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
  },
  intransit: {
    label: 'In Transit',
    icon: Truck,
    iconClass:
      'border-primary/15 bg-primary/5 text-primary dark:border-primary/20 dark:bg-primary/10',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCheck,
    iconClass:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300',
  },
  returned: {
    label: 'Returned',
    icon: RotateCcw,
    iconClass:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    iconClass:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  },
};

const formatAmount = (value) =>
  Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const OrderStats = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();
  const [loading, setLoading] = useState(true);
  const [amountByStatus, setAmountByStatus] = useState({
    pending: 0,
    approved: 0,
    intransit: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data?.orders || [];

      const totals = {
        pending: 0,
        approved: 0,
        intransit: 0,
        delivered: 0,
        returned: 0,
        cancelled: 0,
      };

      orders.forEach((order) => {
        const status = order.orderStatus?.toLowerCase();
        const amount = order.totalAmount || 0;

        if (Object.prototype.hasOwnProperty.call(totals, status)) {
          totals[status] += amount;
        }
      });

      setAmountByStatus(totals);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
      aria-busy={loading}
    >
      <span className="sr-only" role="status">
        {loading ? 'Loading order totals' : ''}
      </span>
      {Object.entries(amountByStatus).map(([status, amount]) => {
        const config = statusConfig[status];
        const Icon = config?.icon || Hourglass;

        if (loading) {
          return (
            <Card key={status} className="border border-border/60 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="size-9 rounded-lg" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          );
        }

        return (
          <Card
            key={status}
            className="border border-border/60 shadow-sm transition-colors hover:border-border"
          >
            <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${config?.iconClass || 'border-border bg-muted text-muted-foreground'}`}
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <span className="text-right text-xs font-medium text-muted-foreground">
                  {config?.label || status}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tabular-nums sm:text-lg">
                  Tk. {formatAmount(amount)}
                </p>
                <p className="text-xs text-muted-foreground">Order value</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderStats;
