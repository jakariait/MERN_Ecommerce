import { API_URL as API } from './config';

// Cache tags for targeted revalidation (see src/app/api/revalidate/route.js).
// The backend calls /api/revalidate?tag=... after content changes so ISR pages
// regenerate immediately instead of waiting for the revalidate window.
export const CACHE_TAGS = {
  global: 'global',
  home: 'home',
  products: 'products',
  shop: 'shop',
  category: 'category',
  blog: 'blog',
  meta: 'meta',
};

async function cachedJson(path, revalidate = 3600, tags = []) {
  const res = await fetch(`${API}${path}`, {
    next: { revalidate, tags },
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

export async function fetchProductBySlug(slug) {
  const data = await cachedJson(`/products/slug/${slug}`, 3600, [
    CACHE_TAGS.products,
    `product:${slug}`,
  ]);
  return data?.data || null;
}

// Slugs for prerendering + ISR warmup. Returns a bounded, recent slice of the
// catalog so build time stays fast; the rest render on-demand via dynamicParams.
export async function fetchProductSlugs(limit = 200) {
  try {
    const data = await cachedJson(
      `/getAllProducts?page=1&limit=${limit}&sort=latest`,
      3600,
      [CACHE_TAGS.products, CACHE_TAGS.shop],
    );
    const products = data.products || [];
    return products.map((p) => ({ slug: p.slug })).filter((p) => p.slug);
  } catch {
    return [];
  }
}

export async function fetchBlogBySlug(slug) {
  const data = await cachedJson(`/blog/slug/${slug}`, 3600, [
    CACHE_TAGS.blog,
    `blog:${slug}`,
  ]);
  return data?.data || null;
}

export async function fetchActiveBlogs(page = 1, limit = 20) {
  const data = await cachedJson(
    `/activeblog?page=${page}&limit=${limit}`,
    3600,
    [CACHE_TAGS.blog],
  );
  return {
    blogs: data.data || [],
    totalPages: data.totalPages || 1,
    currentPage: data.currentPage || page,
  };
}

export async function fetchPageContent(endpoint) {
  try {
    const data = await cachedJson(`/pagecontent/${endpoint}`, 3600, [
      CACHE_TAGS.global,
    ]);
    return data?.content || '';
  } catch {
    return '';
  }
}

export async function fetchHomeData() {
  const [carousel, features, home, flags] = await Promise.allSettled([
    cachedJson('/getallcarousel', 3600, [CACHE_TAGS.home]),
    cachedJson('/feature-images', 3600, [CACHE_TAGS.home]),
    cachedJson('/homepageproducts', 3600, [CACHE_TAGS.home, CACHE_TAGS.products]),
    cachedJson('/flags', 3600, [CACHE_TAGS.home]),
  ]);

  return {
    carousel:
      carousel.status === 'fulfilled' && Array.isArray(carousel.value)
        ? carousel.value
        : [],
    features:
      features.status === 'fulfilled' && Array.isArray(features.value?.data)
        ? features.value.data
        : [],
    homeProducts:
      home.status === 'fulfilled' && home.value?.data ? home.value.data : {},
    flags:
      flags.status === 'fulfilled' && Array.isArray(flags.value?.data)
        ? flags.value.data
        : [],
  };
}

export async function fetchShopProducts(searchParams = {}) {
  const params = new URLSearchParams({
    page: searchParams.page || 1,
    limit: searchParams.limit || 20,
    sort: searchParams.sort || '',
    category: searchParams.category || '',
    subcategory: searchParams.subcategory || '',
    childCategory: searchParams.childCategory || '',
    stock: searchParams.stock || '',
    flags: searchParams.flags || '',
    search: searchParams.search || '',
  });
  const data = await cachedJson(`/getAllProducts?${params.toString()}`, 60, [
    CACHE_TAGS.shop,
    CACHE_TAGS.products,
  ]);
  return {
    products: data.products || [],
    totalProducts: data.totalProducts || 0,
    totalPages: data.totalPages || 0,
    currentPage: data.currentPage || 1,
  };
}

export async function fetchMeta() {
  try {
    const data = await cachedJson('/meta', 3600, [CACHE_TAGS.meta]);
    return data?.data || null;
  } catch {
    return null;
  }
}

export async function fetchGlobalData() {
  const [generalInfo, colors, socialMedia, categories, subCategories, childCategories] =
    await Promise.allSettled([
      cachedJson('/getGeneralInfo', 3600, [CACHE_TAGS.global]),
      cachedJson('/colors', 3600, [CACHE_TAGS.global]),
      cachedJson('/socialmedia', 3600, [CACHE_TAGS.global]),
      cachedJson('/category', 3600, [CACHE_TAGS.global, CACHE_TAGS.category]),
      cachedJson('/sub-category', 3600, [CACHE_TAGS.global, CACHE_TAGS.category]),
      cachedJson('/child-category', 3600, [CACHE_TAGS.global, CACHE_TAGS.category]),
    ]);

  return {
    generalInfo: generalInfo.status === 'fulfilled' ? generalInfo.value : null,
    colors: colors.status === 'fulfilled' ? colors.value?.data || null : null,
    socialMediaLinks:
      socialMedia.status === 'fulfilled' ? socialMedia.value?.data || null : null,
    categories:
      categories.status === 'fulfilled' ? categories.value?.categories || [] : [],
    subCategories:
      subCategories.status === 'fulfilled'
        ? subCategories.value?.subCategories || []
        : [],
    childCategories:
      childCategories.status === 'fulfilled'
        ? childCategories.value?.childCategories || []
        : [],
  };
}