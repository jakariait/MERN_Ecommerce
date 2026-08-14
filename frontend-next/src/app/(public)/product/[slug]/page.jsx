import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchProductSlugs } from '@/lib/server-data';
import { seedProductStore } from '@/lib/server-hydration';
import { HydrateProduct } from '@/lib/store-hydration';
import { absoluteImage, SITE_NAME, SITE_URL } from '@/lib/config';
import ProductDetailsPage from '@/pagesUser/ProductDetailsPage';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await fetchProductSlugs(200);
  return slugs;
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

  const title = product.name || product.metaTitle || 'Product';
  const description =
    product.metaDescription ||
    product.shortDesc ||
    `Shop ${title} at ${SITE_NAME}.`;

  return {
    title,
    description,
    keywords: product.metaKeywords || [],
    alternates: { canonical: `${SITE_URL}/product/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/product/${slug}`,
      siteName: SITE_NAME,
      images: absoluteImage(product.thumbnailImage)
        ? [{ url: absoluteImage(product.thumbnailImage) }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: absoluteImage(product.thumbnailImage)
        ? [absoluteImage(product.thumbnailImage)]
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
  const price =
    product.finalDiscount > 0 ? product.finalDiscount : product.finalPrice;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc || product.metaDescription || undefined,
    image: image ? [image] : undefined,
    sku: product.productCode || product.productId || undefined,
    brand: { '@type': 'Brand', name: product.brand || SITE_NAME },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price,
      availability:
        product.finalStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    ],
  };

  let position = 2;
  if (product.category?.name) {
    breadcrumbLd.itemListElement.push({
      '@type': 'ListItem',
      position: position++,
      name: product.category.name,
      item: `${SITE_URL}/shop?category=${encodeURIComponent(product.category.name)}`,
    });
  }
  breadcrumbLd.itemListElement.push({
    '@type': 'ListItem',
    position,
    name: product.name,
    item: `${SITE_URL}/product/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <HydrateProduct data={product} />
      <ProductDetailsPage />
    </>
  );
}