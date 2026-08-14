import { Suspense } from 'react';
import NotFoundPage from '@/pagesUser/NotFoundPage';

export default function RootNotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundPage />
    </Suspense>
  );
}