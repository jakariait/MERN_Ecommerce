import { notFound } from 'next/navigation';
import {
  fetchBlogBySlug,
  fetchActiveBlogs,
} from '@/lib/server-data';
import { absoluteImage, SITE_NAME, SITE_URL } from '@/lib/config';
import BlogDetailsPage from '@/pagesUser/BlogDetailsPage';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { blogs } = await fetchActiveBlogs(1, 100);
    return blogs
      .map((blog) => ({ slug: blog.slug }))
      .filter((entry) => entry.slug);
  } catch {
    return [];
  }
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
    alternates: { canonical: `${SITE_URL}/blogs/${slug}` },
    openGraph: {
      title: blog.name,
      description,
      url: `${SITE_URL}/blogs/${slug}`,
      siteName: SITE_NAME,
      type: 'article',
      images: absoluteImage(blog.thumbnailImage)
        ? [{ url: absoluteImage(blog.thumbnailImage) }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.name,
      description,
      images: absoluteImage(blog.thumbnailImage)
        ? [absoluteImage(blog.thumbnailImage)]
        : [],
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