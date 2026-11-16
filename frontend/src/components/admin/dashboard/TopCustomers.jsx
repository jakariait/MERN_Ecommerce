import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatMoney, MOCK_TOP_CUSTOMERS } from './data';

export function TopCustomers({
  customers = MOCK_TOP_CUSTOMERS,
  className,
  loading = false,
}) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top Customers</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No customer data</p>
        ) : (
          <div className="space-y-2">
            {customers.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.orders} orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">
                    {formatMoney(c.spent)}
                  </p>
                  <p className="text-xs text-muted-foreground">spent</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TopCustomers;
