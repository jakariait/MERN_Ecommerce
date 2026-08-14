import { fetchActiveBlogs } from '@/lib/server-data';
import { API_URL, SITE_URL } from '@/lib/config';

async function getJSON(path, revalidate = 3600) {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`bad status ${res.status}`);
  return res.json();
}

export const revalidate = 3600;

export default async function sitemap() {
  const [productData, categories, subCategories, childCategories, blogData] =
    await Promise.allSettled([
      getJSON('/getAllProducts?page=1&limit=5000&sort=latest'),
      getJSON('/category'),
      getJSON('/sub-category'),
      getJSON('/child-category'),
      fetchActiveBlogs(1, 100),
    ]);

  const products =
    productData.status === 'fulfilled' ? productData.value.products || [] : [];
  const categoryList =
    categories.status === 'fulfilled' ? categories.value.categories || [] : [];
  const subCategoryList =
    subCategories.status === 'fulfilled'
      ? subCategories.value.subCategories || []
      : [];
  const childCategoryList =
    childCategories.status === 'fulfilled'
      ? childCategories.value.childCategories || []
      : [];
  const blogs = blogData.status === 'fulfilled' ? blogData.value.blogs : [];

  const today = new Date().toISOString();

  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/shop', changefreq: 'daily', priority: 0.9 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
    { loc: '/contact-us', changefreq: 'monthly', priority: 0.7 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
    { loc: '/faqs', changefreq: 'monthly', priority: 0.6 },
    { loc: '/track-order', changefreq: 'monthly', priority: 0.5 },
    { loc: '/login', changefreq: 'monthly', priority: 0.4 },
    { loc: '/register', changefreq: 'monthly', priority: 0.4 },
    { loc: '/termofservice', changefreq: 'monthly', priority: 0.3 },
    { loc: '/privacypolicy', changefreq: 'monthly', priority: 0.3 },
    { loc: '/refundpolicy', changefreq: 'monthly', priority: 0.3 },
    { loc: '/shippinpolicy', changefreq: 'monthly', priority: 0.3 },
  ];

  const urls = staticPages.map((p) => ({
    url: `${SITE_URL}${p.loc}`,
    lastModified: today,
    changeFrequency: p.changefreq,
    priority: p.priority,
  }));

  categoryList.forEach((cat) => {
    if (cat.isActive !== false) {
      urls.push({
        url: `${SITE_URL}/shop?category=${encodeURIComponent(cat.name)}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  });

  subCategoryList.forEach((sub) => {
    if (sub.isActive !== false && sub.slug) {
      urls.push({
        url: `${SITE_URL}/shop?subcategory=${encodeURIComponent(sub.slug)}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  });

  childCategoryList.forEach((child) => {
    if (child.isActive !== false && child.slug) {
      urls.push({
        url: `${SITE_URL}/shop?childCategory=${encodeURIComponent(child.slug)}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  });

  products.forEach((product) => {
    if (product.isActive !== false && product.slug) {
      urls.push({
        url: `${SITE_URL}/product/${product.slug}`,
        lastModified: product.updatedAt || product.createdAt || today,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  blogs.forEach((blog) => {
    if (blog.isActive !== false && blog.slug) {
      urls.push({
        url: `${SITE_URL}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt || blog.createdAt || today,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  });

  return urls;
}