import { fetchHomeData, fetchMeta } from '@/lib/server-data';
import { seedHomeStore } from '@/lib/server-hydration';
import { HydrateHome } from '@/lib/store-hydration';
import HomePage from '@/pagesUser/HomePage';

export const revalidate = 3600;

export async function generateMetadata() {
  const meta = await fetchMeta();
  return {
    title: { absolute: meta?.title || 'Yarnfit' },
    description:
      meta?.description ||
      'Shop the latest collection of clothing and accessories.',
    keywords: meta?.keywords || [],
    alternates: { canonical: '/' },
  };
}

export default async function Home() {
  const data = await fetchHomeData();
  seedHomeStore(data);

  return (
    <>
      <HydrateHome
        carousel={data.carousel}
        features={data.features}
        homeProducts={data.homeProducts}
        flags={data.flags}
      />
      <HomePage />
    </>
  );
}