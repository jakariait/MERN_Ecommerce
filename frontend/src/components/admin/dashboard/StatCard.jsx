import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronUp, ChevronDown, Activity } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  changePositive,
  prefix,
  sparkline,
  showIcon = true,
  icon: Icon = Activity,
}) {
  const hasChange = change != null && change !== '';

  const data = useMemo(
    () =>
      sparkline?.map((v, i) => ({ value: v, x: String(i) })) ||
      Array.from({ length: 7 }, (_, i) => ({ value: Math.round(Math.random() * 100), x: String(i) })),
    [sparkline],
  );

  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="text-xs">vs previous period</CardDescription>
        </div>
        {showIcon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums">
            {prefix ? prefix + ' ' : ''}{value}
          </span>
          {hasChange && (
            <span className="text-xs font-medium leading-none">
              {changePositive ? (
                <>
                  <ChevronUp className="size-3.5 mr-1" /> {change}
                </>
              ) : (
                <>
                  <ChevronDown className="size-3.5 mr-1" /> {change}
                </>
              )}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={data} margin={{ left: 5, right: 5, top: 5, bottom: 5 }}>
              <XAxis hide />
              <YAxis hide />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'white', border: 'none' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardFooter>
    </Card>
  );
}
