import { fetchProductBySlug, fetchActiveBlogs } from '@/lib/server-data';

const FRONTEND_URL = 'https://ecommerce.digiwebdigital.com';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
const API_ORIGIN = API.replace('/api', '');

async function getAllProducts() {
  try {
    const res = await fetch(`${API}/getAllProducts`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    return data.products || data.data || [];
  } catch {
    return [];
  }
}

async function getAllCategories() {
  try {
    const res = await fetch(`${API}/category`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    return data.categories || data.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [products, categories, blogData] = await Promise.allSettled([
    getAllProducts(),
    getAllCategories(),
    fetchActiveBlogs(1, 100),
  ]);

  const productList = products.status === 'fulfilled' ? products.value : [];
  const categoryList =
    categories.status === 'fulfilled' ? categories.value : [];
  const blogs = blogData.status === 'fulfilled' ? blogData.value.blogs : [];

  const today = new Date().toISOString();

  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/shop', changefreq: 'daily', priority: 0.9 },
    { loc: '/contact-us', changefreq: 'monthly', priority: 0.7 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
    { loc: '/faqs', changefreq: 'monthly', priority: 0.6 },
    { loc: '/track-order', changefreq: 'monthly', priority: 0.5 },
    { loc: '/login', changefreq: 'monthly', priority: 0.5 },
    { loc: '/register', changefreq: 'monthly', priority: 0.5 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
    { loc: '/termofservice', changefreq: 'monthly', priority: 0.5 },
    { loc: '/privacypolicy', changefreq: 'monthly', priority: 0.5 },
    { loc: '/refundpolicy', changefreq: 'monthly', priority: 0.5 },
    { loc: '/shippinpolicy', changefreq: 'monthly', priority: 0.5 },
  ];

  const urls = staticPages.map((p) => ({
    url: `${FRONTEND_URL}${p.loc}`,
    lastModified: today,
    changeFrequency: p.changefreq,
    priority: p.priority,
  }));

  categoryList.forEach((cat) => {
    if (cat.isActive !== false) {
      urls.push({
        url: `${FRONTEND_URL}/shop?category=${encodeURIComponent(cat.name)}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  productList.forEach((product) => {
    if (product.isActive !== false) {
      urls.push({
        url: `${FRONTEND_URL}/product/${product.slug}`,
        lastModified: product.updatedAt || today,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  blogs.forEach((blog) => {
    if (blog.isActive !== false) {
      urls.push({
        url: `${FRONTEND_URL}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt || today,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  });

  return urls;
}