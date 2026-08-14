import { Suspense } from 'react';
import CheckoutPage from '@/pagesUser/CheckoutPage';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your purchase on Yarnfit.',
};

export default function Checkout() {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  );
}