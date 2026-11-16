import { cn } from '@/lib/utils';
import { statusChip } from './data';

export function OrderStatusChips({
  counts,
  onStatusChange,
  className,
}) {
  const statuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ];

  const total = statuses.reduce((sum, s) => sum + (counts[s] ?? 0), 0);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        onClick={() => onStatusChange?.('all')}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        All <span className="ml-1 font-bold tabular-nums">{total}</span>
      </button>
      {statuses.map((status) => {
        const chip = statusChip(status);
        const count = counts[status] ?? 0;
        return (
          <button
            key={status}
            onClick={() => onStatusChange?.(status)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
              chip.color,
            )}
          >
            {chip.label} <span className="ml-1 font-bold tabular-nums">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default OrderStatusChips;
