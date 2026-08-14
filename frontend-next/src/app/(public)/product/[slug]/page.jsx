import { notFound } from 'next/navigation';
import { fetchProductBySlug } from '@/lib/server-data';
import { seedProductStore } from '@/lib/server-hydration';
import { HydrateProduct } from '@/lib/store-hydration';
import ProductDetailsPage from '@/pagesUser/ProductDetailsPage';

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
  let product = null;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    // handled by page
  }

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = `${product.name || product.metaTitle || 'Product'}`;
  const description =
    product.metaDescription ||
    product.shortDesc ||
    'Shop this product at Yarnfit.';

  return {
    title,
    description,
    keywords: product.metaKeywords || [],
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title: `${title} | Yarnfit`,
      description,
      url: `https://ecommerce.digiwebdigital.com/product/${slug}`,
      images: absoluteImage(product.thumbnailImage)
        ? [{ url: absoluteImage(product.thumbnailImage) }]
        : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product = null;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    // not found below
  }
  if (!product) notFound();
  seedProductStore(product);

  const image = absoluteImage(product.thumbnailImage);
  const price = product.finalDiscount > 0 ? product.finalDiscount : product.finalPrice;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc || product.metaDescription || undefined,
    image: image ? [image] : undefined,
    sku: product.productCode || product.productId || undefined,
    brand: { '@type': 'Brand', name: 'Yarnfit' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price,
      availability: product.finalStock > 0 ? 'InStock' : 'OutOfStock',
      url: `https://ecommerce.digiwebdigital.com/product/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HydrateProduct data={product} />
      <ProductDetailsPage />
    </>
  );
}