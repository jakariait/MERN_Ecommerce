import { Suspense } from 'react';
import LoginPage from '@/pagesUser/LoginPage';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your Yarnfit account.',
  alternates: { canonical: '/login' },
};

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}