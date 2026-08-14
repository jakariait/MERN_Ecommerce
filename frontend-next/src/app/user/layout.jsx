'use client';

import { Suspense, useEffect, useState } from 'react';
import { Navigate } from '@/lib/router-compat';
import useAuthUserStore from '@/store/AuthUserStore';
import UserLayout from '@/component/componentGeneral/UserLayout';

export default function UserAreaLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useAuthUserStore.getState().hydrateToken();
    setMounted(true);
  }, []);

  const { token } = useAuthUserStore();

  if (!mounted) return null;
  if (!token) return <Navigate to="/login" replace />;

  return (
    <Suspense fallback={null}>
      <UserLayout>{children}</UserLayout>
    </Suspense>
  );
}
