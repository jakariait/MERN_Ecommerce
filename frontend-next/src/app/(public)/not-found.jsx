import { Suspense } from 'react';
import NotFoundPage from '@/pagesUser/NotFoundPage';

export default function PublicNotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundPage />
    </Suspense>
  );
}