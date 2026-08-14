import { Suspense } from 'react';
import { fetchShopProducts, fetchGlobalData } from '@/lib/server-data';
import { seedShopStore } from '@/lib/server-hydration';
import { HydrateShop } from '@/lib/store-hydration';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import ShopPage from '@/pagesUser/ShopPage';

export const revalidate = 60;

// Only single-dimension landing pages (category / subcategory / childCategory)
// are indexable with a self-canonical URL. Search, sort, stock, flags and
// pagination are noindexed to prevent unbounded crawlable URL combinations.
const INDEXABLE_KEYS = ['category', 'subcategory', 'childCategory'];

function buildQueryKey(sp) {
  const params = new URLSearchParams({
    page: sp.page || 1,
    limit: sp.limit || 20,
    sort: sp.sort || '',
    category: sp.category || '',
    subcategory: sp.subcategory || '',
    childCategory: sp.childCategory || '',
    stock: sp.stock || '',
    flags: sp.flags || '',
    search: sp.search || '',
  });
  return params.toString();
}

function isIndexable(sp) {
  if (sp.search || sp.flags || sp.stock || sp.sort || sp.limit) return false;
  if (sp.page && parseInt(sp.page, 10) > 1) return false;
  const active = INDEXABLE_KEYS.filter((key) => sp[key]).length;
  return active <= 1;
}

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const indexable = isIndexable(sp);

  let canonicalParam = '';
  if (sp.category) canonicalParam = `?category=${encodeURIComponent(sp.category)}`;
  else if (sp.subcategory) canonicalParam = `?subcategory=${encodeURIComponent(sp.subcategory)}`;
  else if (sp.childCategory) canonicalParam = `?childCategory=${encodeURIComponent(sp.childCategory)}`;

  const canonical = indexable
    ? `${SITE_URL}/shop${canonicalParam}`
    : `${SITE_URL}/shop`;

  const global = await fetchGlobalData();
  const name =
    sp.category ||
    global.subCategories.find((s) => s.slug === sp.subcategory)?.name ||
    global.childCategories.find((c) => c.slug === sp.childCategory)?.name ||
    'Shop';

  return {
    title: name,
    description: `Browse the best ${name} collection at ${SITE_NAME}.`,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function Shop({ searchParams }) {
  const sp = await searchParams;
  const data = await fetchShopProducts(sp);
  const queryKey = buildQueryKey(sp);
  seedShopStore(data, queryKey);

  return (
    <Suspense fallback={null}>
      <HydrateShop {...data} queryKey={queryKey} />
      <ShopPage />
    </Suspense>
  );
}
