import { Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatMoney, MOCK_TOP_PRODUCTS } from './data';

export function TopProducts({
  products = MOCK_TOP_PRODUCTS,
  className,
  loading = false,
}) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top-Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        {loading ? (
          <SkeletonList count={5} />
        ) : products.length === 0 ? (
          <EmptyState icon={<ImageIcon className="size-6" />} text="No products yet" />
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="relative shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="size-12 rounded-lg object-cover"
                  />
                  <Badge variant="secondary" className="absolute -bottom-1 -right-1 text-[10px]">
                    {p.units} sold
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(p.revenue)} revenue
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">{p.units}</p>
                  <p className="text-xs text-muted-foreground">units</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="size-12 rounded-lg bg-muted animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="size-10 text-muted-foreground mb-2">{icon}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export default TopProducts;
