import { Suspense } from 'react';
import BkashCallbackPage from '@/pagesUser/BkashCallbackPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Payment Callback',
  robots: { index: false, follow: false },
};

export default function BkashCallback() {
  return (
    <Suspense fallback={null}>
      <BkashCallbackPage />
    </Suspense>
  );
}