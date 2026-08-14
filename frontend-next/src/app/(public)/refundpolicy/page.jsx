import { fetchPageContent } from '@/lib/server-data';
import RefundPolicyPage from '@/pagesUser/RefundPolicyPage';

export const revalidate = 60;

export const metadata = {
  title: 'Refund Policy',
  description: 'Read the refund policy for purchases made on Yarnfit.',
  alternates: { canonical: '/refundpolicy' },
};

export default async function Refund() {
  const initialContent = await fetchPageContent('refund');
  return <RefundPolicyPage initialContent={initialContent} />;
}