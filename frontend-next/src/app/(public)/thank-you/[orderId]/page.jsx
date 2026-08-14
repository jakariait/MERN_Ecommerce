import ThankYouPage from '@/pagesUser/ThankYouPage';

export const metadata = {
  title: 'Thank You',
  robots: { index: false },
};

export default function ThankYou({ params }) {
  return <ThankYouPage />;
}