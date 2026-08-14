import { Suspense } from 'react';
import CheckoutPage from '@/pagesUser/CheckoutPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your purchase on Yarnfit.',
  robots: { index: false, follow: false },
};

export default function Checkout() {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  );
}