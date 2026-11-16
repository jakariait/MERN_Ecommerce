import { Activity, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MOCK_ACTIVITY, MOCK_REVIEWS } from './data';

const ACTIVITY_ICON = {
  order: Activity,
  review: Star,
  alert: Clock,
};

export function ActivityFeed({
  activity = MOCK_ACTIVITY,
  reviews = MOCK_REVIEWS,
  className,
}) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <p className="text-xs font-semibold uppercase tracking-tighter">
              Activity
            </p>
            <span className="ml-auto text-xs text-muted-foreground">
              {activity.length} recent events
            </span>
          </div>
          <div className="space-y-3">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICON[item.type] || Activity;
              return (
                <div key={item.time} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.actor}</span>{' '}
                      {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <div className="border-t" />
      <CardContent className="pt-3">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold uppercase tracking-tighter">
            Reviews awaiting approval
          </p>
          <span className="ml-auto text-xs text-muted-foreground">
            {reviews.length} pending
          </span>
        </div>
        <div className="space-y-2 mt-2">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-3 p-2 rounded-lg bg-muted/50">
              <div className="size-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                {r.customer.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1 text-sm">
                  <span className="font-medium text-foreground">{r.customer}</span>
                  <span className="text-amber-500">{'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  &quot;{r.text}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.product}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;
