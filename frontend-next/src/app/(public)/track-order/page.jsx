import TrackOrderPage from '@/pagesUser/TrackOrderPage';

export const metadata = {
  title: 'Track Order',
  description: 'Track the status of your Yarnfit order.',
  alternates: { canonical: '/track-order' },
};

export default function TrackOrder() {
  return <TrackOrderPage />;
}