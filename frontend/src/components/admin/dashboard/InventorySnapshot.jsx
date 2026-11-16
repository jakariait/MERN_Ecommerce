import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MOCK_INVENTORY } from './data';

export function InventorySnapshot({
  data = MOCK_INVENTORY,
  className,
  loading = false,
}) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Inventory Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-end gap-2">
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                <div className="h-6 w-1/3 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <StatRow label="Total Products" value={data.totalProducts} suffix="" />
            <StatRow label="Low Stock" value={data.lowStock} suffix="" variant="warning" />
            <StatRow label="Out of Stock" value={data.outOfStock} suffix="" variant="error" />
            <StatRow label="Stock Value" value={data.stockValue} prefix="৳" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatRow({ label, value, prefix, suffix = '', variant }) {
  return (
    <div className="flex items-baseline gap-1 p-2 rounded-lg border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <span className={`text-sm font-bold tabular-nums ml-auto ${variant === 'warning' ? 'text-amber-700' : variant === 'error' ? 'text-rose-700' : 'text-foreground'}`}>
        {prefix ? prefix + ' ' : ''}{value}{suffix}
      </span>
    </div>
  );
}

export default InventorySnapshot;
