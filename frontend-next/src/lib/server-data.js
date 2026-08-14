const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

async function cachedJson(path, revalidate = 60) {
  const res = await fetch(`${API}${path}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

export async function fetchProductBySlug(slug) {
  const data = await cachedJson(`/products/slug/${slug}`);
  return data?.data || null;
}

export async function fetchBlogBySlug(slug) {
  const data = await cachedJson(`/blog/slug/${slug}`);
  return data?.data || null;
}

export async function fetchActiveBlogs(page = 1, limit = 20) {
  const data = await cachedJson(`/activeblog?page=${page}&limit=${limit}`);
  return {
    blogs: data.data || [],
    totalPages: data.totalPages || 1,
    currentPage: data.currentPage || page,
  };
}

export async function fetchPageContent(endpoint) {
  try {
    const data = await cachedJson(`/pagecontent/${endpoint}`);
    return data?.content || '';
  } catch {
    return '';
  }
}

export async function fetchHomeData() {
  const [carousel, features, home, flags] = await Promise.allSettled([
    cachedJson('/getallcarousel'),
    cachedJson('/feature-images'),
    cachedJson('/homepageproducts'),
    cachedJson('/flags'),
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
  const data = await cachedJson(`/getAllProducts?${params.toString()}`);
  return {
    products: data.products || [],
    totalProducts: data.totalProducts || 0,
    totalPages: data.totalPages || 0,
    currentPage: data.currentPage || 1,
  };
}

export async function fetchMeta() {
  try {
    const data = await cachedJson('/meta');
    return data?.data || null;
  } catch {
    return null;
  }
}

export async function fetchGlobalData() {
  const [generalInfo, colors, socialMedia, categories, subCategories, childCategories] =
    await Promise.allSettled([
      cachedJson('/getGeneralInfo'),
      cachedJson('/colors'),
      cachedJson('/socialmedia'),
      cachedJson('/category'),
      cachedJson('/sub-category'),
      cachedJson('/child-category'),
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