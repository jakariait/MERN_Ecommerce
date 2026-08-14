import { Suspense } from 'react';
import ForgetPasswordPage from '@/pagesUser/ForgetPasswordPage';

export const metadata = {
  title: 'Forgot Password',
  robots: { index: false },
};

export default function ForgotPassword() {
  return (
    <Suspense fallback={null}>
      <ForgetPasswordPage />
    </Suspense>
  );
}