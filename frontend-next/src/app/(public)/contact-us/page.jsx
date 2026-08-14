import ContactUsPage from '@/pagesUser/ContactUsPage';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Yarnfit for any questions or support.',
  alternates: { canonical: '/contact-us' },
};

export default function Contact() {
  return <ContactUsPage />;
}