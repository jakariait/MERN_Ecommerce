'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navigate } from '@/lib/router-compat';
import useAuthAdminStore from '@/store/AuthAdminStore';
import LayoutAdmin from '@/component/componentAdmin/LayoutAdmin';

export default function AdminAreaLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useAuthAdminStore.getState().hydrateToken();
    setMounted(true);
  }, []);

  if (pathname === '/admin/login') {
    return <Suspense fallback={null}>{children}</Suspense>;
  }

  const { token } = useAuthAdminStore();
  if (!mounted) return null;
  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <Suspense fallback={null}>
      <LayoutAdmin>{children}</LayoutAdmin>
    </Suspense>
  );
}
