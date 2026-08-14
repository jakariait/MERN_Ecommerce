import { fetchPageContent } from '@/lib/server-data';
import PrivacyPolicyPage from '@/pagesUser/PrivacyPolicyPage';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy for using Yarnfit.',
  alternates: { canonical: '/privacypolicy' },
};

export default async function Privacy() {
  const initialContent = await fetchPageContent('privacy');
  return <PrivacyPolicyPage initialContent={initialContent} />;
}