export const CURRENCY_SYMBOL = '৳';

export const formatMoney = (value, decimals = 2) =>
  `${CURRENCY_SYMBOL} ${Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

export const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString(undefined);

export const PERIODS = [
  { label: 'Today', value: 'today' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: 'Custom', value: 'custom' },
];

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const STATUS_COLOR = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  processing: 'bg-blue-50 text-blue-700 border-blue-100',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
  returned: 'bg-amber-100 text-amber-800 border-amber-200',
};

export const statusChip = (status) => ({
  label: STATUS_LABELS[status] || status,
  color: STATUS_COLOR[status] || 'bg-muted text-muted-foreground',
});

export const MOCK_KPIS = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '842,500',
    change: '+12.4%',
    changePositive: true,
    prefix: CURRENCY_SYMBOL,
    sparkline: [30, 45, 38, 52, 41, 60, 55],
  },
  {
    id: 'orders',
    title: 'Total Orders',
    value: '3,842',
    change: '+8.1%',
    changePositive: true,
    sparkline: [12, 18, 15, 22, 19, 26, 24],
  },
  {
    id: 'aov',
    title: 'Avg. Order Value',
    value: '2,192',
    change: '+3.2%',
    changePositive: true,
    prefix: CURRENCY_SYMBOL,
    sparkline: [88, 92, 90, 95, 91, 98, 94],
  },
  {
    id: 'customers',
    title: 'New Customers',
    value: '1,240',
    change: '+15.6%',
    changePositive: true,
    sparkline: [40, 32, 48, 44, 52, 60, 58],
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '3.4%',
    change: '-0.8%',
    changePositive: false,
    sparkline: [3.1, 3.3, 3.5, 3.2, 3.6, 3.4, 3.0],
  },
  {
    id: 'refunds',
    title: 'Refunds / Returns',
    value: '84',
    change: '-6.1%',
    changePositive: true,
    sparkline: [12, 9, 11, 14, 10, 8, 7],
  },
];

export const MOCK_SALES = [
  { name: 'Mon', revenue: 48000, orders: 24 },
  { name: 'Tue', revenue: 62000, orders: 31 },
  { name: 'Wed', revenue: 54000, orders: 27 },
  { name: 'Thu', revenue: 71000, orders: 36 },
  { name: 'Fri', revenue: 89000, orders: 45 },
  { name: 'Sat', revenue: 105000, orders: 52 },
  { name: 'Sun', revenue: 94000, orders: 47 },
];

export const MOCK_CATEGORY_SALES = [
  { name: 'Menswear', value: 320000 },
  { name: 'Womenswear', value: 450000 },
  { name: 'Accessories', value: 180000 },
  { name: 'Footwear', value: 210000 },
  { name: 'Kids', value: 140000 },
];

export const MOCK_CHANNELS = [
  { name: 'Direct', value: 45 },
  { name: 'Social', value: 28 },
  { name: 'Search', value: 17 },
  { name: 'Email', value: 10 },
];

export const MOCK_STATUS_COUNTS = {
  pending: 48,
  processing: 62,
  shipped: 112,
  delivered: 342,
  cancelled: 18,
  returned: 12,
};

export const MOCK_RECENT_ORDERS = [
  {
    id: '#10482',
    date: '2026-11-10T14:22:00Z',
    customer: 'Rahim Ahmed',
    phone: '+880 1712-345678',
    items: 3,
    amount: 8450,
    paymentStatus: 'paid',
    status: 'processing',
  },
  {
    id: '#10481',
    date: '2026-11-10T12:05:00Z',
    customer: 'Sadia Khan',
    phone: '+880 1811-223344',
    items: 1,
    amount: 2299,
    paymentStatus: 'paid',
    status: 'shipped',
  },
  {
    id: '#10480',
    date: '2026-11-10T09:40:00Z',
    customer: 'Karim Hossain',
    phone: '+880 1911-009988',
    items: 2,
    amount: 5120,
    paymentStatus: 'pending',
    status: 'pending',
  },
  {
    id: '#10479',
    date: '2026-11-09T18:10:00Z',
    customer: 'Nusrat Jahan',
    phone: '+880 1722-112233',
    items: 4,
    amount: 12400,
    paymentStatus: 'paid',
    status: 'delivered',
  },
  {
    id: '#10478',
    date: '2026-11-09T15:30:00Z',
    customer: 'Tanvir Islam',
    phone: '+880 1833-445566',
    items: 1,
    amount: 1799,
    paymentStatus: 'failed',
    status: 'cancelled',
  },
];

export const MOCK_ALERTS = [
  {
    id: 'a1',
    type: 'low-stock',
    title: 'Low stock: Cotton T-Shirt (M)',
    subtitle: 'Only 4 left — reorder soon',
    severity: 'warning',
  },
  {
    id: 'a2',
    type: 'out-of-stock',
    title: 'Out of stock: Denim Jacket (L)',
    subtitle: '0 units available',
    severity: 'error',
  },
  {
    id: 'a3',
    type: 'failed-payment',
    title: 'Failed payment on order #10478',
    subtitle: 'Customer notified, retry available',
    severity: 'error',
  },
  {
    id: 'a4',
    type: 'refund',
    title: 'Pending refund: order #10473',
    subtitle: '৳3,200 — awaiting processing',
    severity: 'info',
  },
  {
    id: 'a5',
    type: 'unfulfilled',
    title: 'Unfulfilled order older than 24h',
    subtitle: 'Order #10469 placed 26h ago',
    severity: 'warning',
  },
];

export const MOCK_TOP_PRODUCTS = [
  {
    id: 'p1',
    name: 'Cotton Oversize T-Shirt',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=160&h=160&fit=crop',
    units: 124,
    revenue: 49600,
  },
  {
    id: 'p2',
    name: 'Slim Fit Denim Jeans',
    image:
      'https://images.unsplash.com/photo-1542273917363-3b18244216d5?w=160&h=160&fit=crop',
    units: 98,
    revenue: 58800,
  },
  {
    id: 'p3',
    name: 'Canvas Sneakers White',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=160&h=160&fit=crop',
    units: 86,
    revenue: 34400,
  },
  {
    id: 'p4',
    name: 'Wool Blend Coat',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=160&h=160&fit=crop',
    units: 64,
    revenue: 57600,
  },
  {
    id: 'p5',
    name: 'Leather Crossbody Bag',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=160&h=160&fit=crop',
    units: 57,
    revenue: 28500,
  },
];

export const MOCK_TOP_CUSTOMERS = [
  { id: 'c1', name: 'Aisha Rahman', orders: 12, spent: 48500, avatar: 'A' },
  { id: 'c2', name: 'Farhad Ahmed', orders: 9, spent: 32100, avatar: 'F' },
  { id: 'c3', name: 'Nabila Chowdhury', orders: 7, spent: 25400, avatar: 'N' },
  { id: 'c4', name: 'Imran Hossain', orders: 6, spent: 19800, avatar: 'I' },
];

export const MOCK_ACTIVITY = [
  { time: '2m ago', actor: 'Rahim A.', action: 'placed order #10482', type: 'order' },
  { time: '14m ago', actor: 'Sadia K.', action: 'reviewed Cotton T-Shirt (4★)', type: 'review' },
  { time: '41m ago', actor: 'System', action: 'Low stock alert: Denim Jacket', type: 'alert' },
  { time: '1h ago', actor: 'Karim H.', action: 'cancelled order #10478', type: 'order' },
  { time: '2h ago', actor: 'Nusrat J.', action: 'order #10479 delivered', type: 'order' },
];

export const MOCK_REVIEWS = [
  { id: 'r1', customer: 'Rahim A.', product: 'Canvas Sneakers', rating: 5, text: 'Great fit and quality.', date: '1h ago' },
  { id: 'r2', customer: 'Sadia K.', product: 'Cotton T-Shirt', rating: 4, text: 'Comfortable, color faded slightly after wash.', date: '3h ago' },
  { id: 'r3', customer: 'Tanvir I.', product: 'Denim Jacket', rating: 2, text: 'Zipper broke after one use.', date: '6h ago' },
];

export const MOCK_INVENTORY = {
  totalProducts: 1240,
  lowStock: 34,
  outOfStock: 9,
  stockValue: 8560000,
};
