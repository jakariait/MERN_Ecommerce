import { Suspense } from 'react';
import { fetchShopProducts } from '@/lib/server-data';
import { seedShopStore } from '@/lib/server-hydration';
import { HydrateShop } from '@/lib/store-hydration';
import ShopPage from '@/pagesUser/ShopPage';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'Shop' },
  description: 'Browse our full collection of clothing and accessories.',
  alternates: { canonical: '/shop' },
};

export default async function Shop({ searchParams }) {
  const sp = await searchParams;
  const data = await fetchShopProducts(sp);
  seedShopStore(data);

  return (
    <Suspense fallback={null}>
      <HydrateShop {...data} />
      <ShopPage />
    </Suspense>
  );
}