import FAQPage from '@/pagesUser/FAQPage';

export const metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about Yarnfit.',
  alternates: { canonical: '/faqs' },
};

export default function FAQs() {
  return <FAQPage />;
}