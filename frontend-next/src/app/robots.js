export const metadata = {
  title: 'Robots',
};

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/user/'],
    },
    sitemap: 'https://ecommerce.digiwebdigital.com/sitemap.xml',
  };
}