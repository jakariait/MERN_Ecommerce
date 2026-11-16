import { Plus, FileText, Ship, Tag, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function QuickActions({
  onAddProduct,
  onCreateCoupon,
  onExportReport,
  onManageShipping,
  className,
}) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ActionButton
            label="Add Product"
            icon={Plus}
            onClick={onAddProduct}
            variant="default"
          />
          <ActionButton
            label="Create Coupon"
            icon={Tag}
            onClick={onCreateCoupon}
            variant="outline"
          />
          <ActionButton
            label="Export Report"
            icon={FileText}
            onClick={onExportReport}
            variant="outline"
          />
          <ActionButton
            label="Manage Shipping"
            icon={Ship}
            onClick={onManageShipping}
            variant="outline"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButton({ label, icon: Icon, onClick, variant }) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className="w-full flex-col items-center gap-1.5 px-2 py-3 text-sm"
      aria-label={label}
    >
      <Icon className="size-4" />
      <span>{label}</span>
      <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
}

export default QuickActions;
