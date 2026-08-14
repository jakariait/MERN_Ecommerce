import { Suspense } from 'react';
import { fetchActiveBlogs } from '@/lib/server-data';
import BlogsPage from '@/pagesUser/BlogsPage';

export const revalidate = 3600;

export const metadata = {
  title: 'Blog',
  description: 'Stay informed with the latest articles and updates from Yarnfit.',
  alternates: { canonical: '/blog' },
};

export default async function Blogs({ searchParams }) {
  const sp = await searchParams;
  const page = parseInt(sp.page, 10) || 1;
  const initialData = await fetchActiveBlogs(page, 20);

  return (
    <Suspense fallback={null}>
      <BlogsPage initialData={initialData} />
    </Suspense>
  );
}