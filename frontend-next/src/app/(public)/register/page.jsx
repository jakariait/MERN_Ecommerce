import { Suspense } from 'react';
import RegisterPage from '@/pagesUser/RegisterPage';

export const metadata = {
  title: 'Register',
  description: 'Create a new Yarnfit account.',
  alternates: { canonical: '/register' },
};

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  );
}