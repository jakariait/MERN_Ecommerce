import { fetchPageContent } from '@/lib/server-data';
import TosPage from '@/pagesUser/TosPage';

export const metadata = {
  title: 'Terms of Service',
  description: 'Read the terms of service for using Yarnfit.',
  alternates: { canonical: '/termofservice' },
};

export default async function Terms() {
  const initialContent = await fetchPageContent('terms');
  return <TosPage initialContent={initialContent} />;
}