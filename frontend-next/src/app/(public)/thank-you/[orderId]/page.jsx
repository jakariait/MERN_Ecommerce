import ThankYouPage from '@/pagesUser/ThankYouPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Thank You',
  robots: { index: false, follow: false },
};

export default function ThankYou({ params }) {
  return <ThankYouPage />;
}