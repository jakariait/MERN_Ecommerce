import { AlertTriangle, AlertCircle, Landmark, RefreshCw, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MOCK_ALERTS } from './data';

const SEVERITY_ICON = {
  warning: AlertTriangle,
  error: AlertCircle,
  info: Landmark,
};

const SEVERITY_CLASS = {
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  error: 'bg-rose-50 text-rose-700 border-rose-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
};

export function AlertsPanel({
  alerts = MOCK_ALERTS,
  onResolve,
  className,
  loading = false,
}) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="flex items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          <CardDescription className="text-xs">Requires your attention</CardDescription>
        </div>
        <Button size="xs" onClick={onResolve} className="text-xs">
          <RefreshCw className="size-3.5 mr-1" /> Resolve all
        </Button>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        ) : alerts.length === 0 ? (
          <EmptyAlerts />
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => {
              const Icon = SEVERITY_ICON[alert.severity] || AlertTriangle;
              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border transition-hover hover:bg-muted/50 cursor-pointer group"
                >
                  <div
                    className={cn(
                      'mt-0.5 flex size-6 items-center justify-center rounded-full',
                      SEVERITY_CLASS[alert.severity],
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <Badge variant="outline" className="text-xs uppercase tracking-tighter">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {alert.subtitle}
                    </p>
                  </div>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve?.(alert.id);
                    }}
                    aria-label={`Resolve ${alert.title}`}
                  >
                    <Clock className="size-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {alerts.length} active alerts
          </span>
          <div className="h-px w-4 flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Last checked just now</span>
        </div>
      </CardFooter>
    </Card>
  );
}

function EmptyAlerts() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="size-10 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">No alerts at the moment.</p>
    </div>
  );
}
