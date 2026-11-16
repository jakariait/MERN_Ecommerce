import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  MOCK_CATEGORY_SALES,
  MOCK_CHANNELS,
  formatMoney,
  formatNumber,
} from './data';

export function SalesChart({ className }) {
  const [mode, setMode] = useState('revenue');

  return (
    <Card className={cn('border', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sales Overview</CardTitle>
        <CardDescription className="text-xs">Last 30 days</CardDescription>
        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setMode('revenue')}
            className={cn('px-2 py-1 rounded-md transition-colors', mode === 'revenue' ? 'bg-indigo-100 text-indigo-700' : 'text-muted-foreground hover:bg-accent')}
          >
            Revenue
          </button>
          <button
            onClick={() => setMode('orders')}
            className={cn('px-2 py-1 rounded-md transition-colors', mode === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'text-muted-foreground hover:bg-accent')}
          >
            Orders
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0 h-[260px] md:h-[300px]">
        <div className="h-full w-full">
          {mode === 'revenue' ? (
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis hide tickCount={4} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="revenue" fill="#4f46e5" fillOpacity={0.1} />
            </LineChart>
          ) : (
            <BarChart>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis hide tickCount={4} />
              <Tooltip />
              <Bar dataKey="orders" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {mode === 'revenue' ? (
          <div className="text-right text-xs text-muted-foreground">
            {formatMoney(48000 + 62000 + 54000 + 71000 + 89000 + 105000 + 94000)}
          </div>
        ) : (
          <div className="text-right text-xs text-muted-foreground">
            {formatNumber(24 + 31 + 27 + 36 + 45 + 52 + 47)} orders
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function CategoryDonut({ className }) {
  const data = MOCK_CATEGORY_SALES;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Sales by Category</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0 h-[240px]">
        <div className="flex h-full items-center justify-center">
          <svg
            width="180"
            height="180"
            viewBox="0 0 42 42"
            className="text-[color:var(--border)]"
          >
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            {data.map((item, i) => {
              const cumPrev = data.slice(0, i).reduce((sum, d) => sum + d.value, 0);
              const startAngle = (cumPrev / total) * 360;
              const sweepAngle = (item.value / total) * 360;
              const endAngle = startAngle + sweepAngle;
              const rad = (Math.PI / 180) * (startAngle - 90);
              const x1 = 21 + 15.915 * Math.cos(rad);
              const y1 = 21 + 15.915 * Math.sin(rad);
              const rad2 = (Math.PI / 180) * (endAngle - 90);
              const x2 = 21 + 15.915 * Math.cos(rad2);
              const y2 = 21 + 15.915 * Math.sin(rad2);
              const largeArc = sweepAngle > 180 ? 1 : 0;
              return (
                <path
                  key={item.name}
                  d={`M ${x1} ${y1} A 15.915 15.915 0 ${largeArc} 1 ${x2} ${y2} L 21 21 Z`}
                  fill={colors[i % colors.length]}
                />
              );
            })}
          </svg>
          <div className="text-center">
            <div className="text-xs font-semibold">
              {formatMoney(total)}
            </div>
            <div className="text-xs text-muted-foreground">category sales</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="grid grid-cols-3 gap-2">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <span className="size-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="truncate w-16">{item.name}</span>
              <span className="ml-auto text-muted-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export function ChannelBar({ data = MOCK_CHANNELS, className }) {
  return (
    <Card className={cn('border', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Sales by Channel</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-0 h-[200px]">
        <BarChart width={400} height={160} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="grid grid-cols-4 gap-2 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              <span className="truncate w-[70px]">{item.name}</span>
              <span className="ml-auto text-muted-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
