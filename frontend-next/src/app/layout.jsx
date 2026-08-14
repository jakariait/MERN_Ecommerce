import { Suspense } from 'react';
import '../index.css';
import '../assets/fonts.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchGlobalData, fetchMeta } from '@/lib/server-data';
import { seedGlobalStore } from '@/lib/server-hydration';
import RootProviders from './RootProviders';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export async function generateMetadata() {
  const meta = await fetchMeta();
  const siteTitle = meta?.title || 'Yarnfit';
  const siteDescription =
    meta?.description ||
    'Shop the latest collection of clothing and accessories.';
  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: meta?.keywords || [],
    metadataBase: new URL('https://ecommerce.digiwebdigital.com'),
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: 'website',
    },
  };
}

export default async function RootLayout({ children }) {
  const global = await fetchGlobalData();
  seedGlobalStore(global);

  return (
    <html lang="en">
      <body className="antialiased">
        <RootProviders global={global}>
          <Suspense fallback={null}>{children}</Suspense>
        </RootProviders>
      </body>
    </html>
  );
}