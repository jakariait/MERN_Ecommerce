import { fetchPageContent } from '@/lib/server-data';
import ShippingPolicyPage from '@/pagesUser/ShippingPolicyPage';

export const metadata = {
  title: 'Shipping Policy',
  description: 'Read the shipping policy for orders placed on Yarnfit.',
  alternates: { canonical: '/shippinpolicy' },
};

export default async function Shipping() {
  const initialContent = await fetchPageContent('shipping');
  return <ShippingPolicyPage initialContent={initialContent} />;
}