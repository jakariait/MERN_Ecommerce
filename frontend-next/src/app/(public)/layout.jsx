import { Suspense } from 'react';
import Layout from '@/component/componentGeneral/Layout';

export const revalidate = 60;

export default function PublicLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <Layout>{children}</Layout>
    </Suspense>
  );
}