import { fetchPageContent } from '@/lib/server-data';
import AboutUsPageUser from '@/pagesUser/AboutUsPageUser';

export const revalidate = 60;

export const metadata = {
  title: 'About Us',
  description: 'Learn more about Yarnfit.',
  alternates: { canonical: '/about' },
};

export default async function About() {
  const initialContent = await fetchPageContent('about');
  return <AboutUsPageUser initialContent={initialContent} />;
}