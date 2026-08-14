import { Suspense } from 'react';
import ResetPasswordPage from '@/pagesUser/ResetPasswordPage';

export const metadata = {
  title: 'Reset Password',
  robots: { index: false },
};

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}