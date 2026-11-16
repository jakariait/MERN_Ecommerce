import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit3, Printer, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMoney, statusChip, MOCK_RECENT_ORDERS } from './data';

const PAYMENT_BADGE = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  failed: 'bg-rose-50 text-rose-700 border-rose-100',
  refunded: 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

export function OrdersTable({
  orders,
  onView,
  onUpdateStatus,
  onPrintInvoice,
  className,
  loading = false,
}) {
  const rows = loading || !orders?.length ? MOCK_RECENT_ORDERS : orders;

  return (
    <div className={cn('rounded-xl border overflow-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Order ID</TableHead>
            <TableHead className="w-40">Customer</TableHead>
            <TableHead className="w-16 text-right">Items</TableHead>
            <TableHead className="w-24 text-right">Amount</TableHead>
            <TableHead className="w-24">Payment</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-20">Date</TableHead>
            <TableHead className="w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => {
            const status = statusChip(order.status);
            const payment = PAYMENT_BADGE[order.paymentStatus] || 'bg-muted text-muted-foreground';
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.customer}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">
                  {order.items}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatMoney(order.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={payment}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={status.color}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(order.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => onView?.(order.id)}
                      aria-label={`View order ${order.id}`}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => onUpdateStatus?.(order)}
                      aria-label={`Update status for ${order.id}`}
                    >
                      <Edit3 className="size-4" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => onPrintInvoice?.(order.id)}
                      aria-label={`Print invoice ${order.id}`}
                    >
                      <Printer className="size-4" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="hidden md:block"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
