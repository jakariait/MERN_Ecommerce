import { notFound } from 'next/navigation';
import { fetchBlogBySlug } from '@/lib/server-data';
import BlogDetailsPage from '@/pagesUser/BlogDetailsPage';

export const revalidate = 60;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
const API_ORIGIN = API.replace('/api', '');

function absoluteImage(imageName) {
  if (!imageName) return undefined;
  if (/^(https?:|data:|blob:)/.test(imageName)) return imageName;
  return `${API_ORIGIN}/uploads/${imageName}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let blog = null;
  try {
    blog = await fetchBlogBySlug(slug);
  } catch {
    // handled below
  }
  if (!blog) return { title: 'Blog Not Found' };

  const description =
    blog.longDesc?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) ||
    blog.name;

  return {
    title: blog.name,
    description,
    keywords: blog.searchTags || [],
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      title: blog.name,
      description,
      images: absoluteImage(blog.thumbnailImage)
        ? [{ url: absoluteImage(blog.thumbnailImage) }]
        : [],
      type: 'article',
    },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  let blog = null;
  try {
    blog = await fetchBlogBySlug(slug);
  } catch {
    // not found below
  }
  if (!blog) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.name,
    image: absoluteImage(blog.thumbnailImage),
    datePublished: blog.createdAt || blog.updatedAt || undefined,
    dateModified: blog.updatedAt || undefined,
    author: { '@type': 'Person', name: blog.author || 'Yarnfit' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailsPage initialData={blog} />
    </>
  );
}