import '../index.css';
import '../assets/fonts.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchGlobalData, fetchMeta } from '@/lib/server-data';
import { seedGlobalStore } from '@/lib/server-hydration';
import { SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteImage } from '@/lib/config';
import RootProviders from './RootProviders';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export async function generateMetadata() {
  const meta = await fetchMeta();
  const siteTitle = meta?.title || SITE_NAME;
  const siteDescription = meta?.description || SITE_TAGLINE;
  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: meta?.keywords || [],
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: 'website',
      siteName: siteTitle,
      url: SITE_URL,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
    },
  };
}

export default async function RootLayout({ children }) {
  const global = await fetchGlobalData();
  seedGlobalStore(global);

  const companyName = global.generalInfo?.CompanyName || SITE_NAME;

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyName,
    url: SITE_URL,
    logo: absoluteImage(global.generalInfo?.PrimaryLogo),
    description: global.generalInfo?.ShortDescription || SITE_TAGLINE,
    email: global.generalInfo?.CompanyEmail?.[0],
    telephone: global.generalInfo?.PhoneNumber?.[0],
    address: {
      '@type': 'PostalAddress',
      addressLocality: global.generalInfo?.CompanyAddress,
      addressCountry: 'BD',
    },
  };

  const webSiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: companyName,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />
        <RootProviders global={global}>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}