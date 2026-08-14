// Server-side store seeding. Called from Server Component pages BEFORE React
// renders, so the SSR HTML contains real content (the zustand-compatible stores
// read getState() as the server snapshot, see src/lib/create-store.js).

import CarouselStore from '../store/CarouselStore.js';
import FeatureStore from '../store/FeatureStore.js';
import useProductStore from '../store/useProductStore.js';
import useFlagStore from '../store/useFlagStore.js';
import useCategoryStore from '../store/useCategoryStore.js';
import useSubCategoryStore from '../store/useSubCategoryStore.js';
import useChildCategoryStore from '../store/useChildCategoryStore.js';
import GeneralInfoStore from '../store/GeneralInfoStore.js';
import SocialMediaLinkStore from '../store/SocialMediaLinkStore.js';
import useColorStore from '../store/ColorStore.js';

export function seedProductStore(data) {
  if (!data) return;
  useProductStore.setState({ product: data, loading: false, error: null });
}

export function seedShopStore(
  { products, totalProducts, totalPages, currentPage },
  queryKey = '',
) {
  useProductStore.setState({
    products: products || [],
    totalProducts: totalProducts || 0,
    totalPages: totalPages || 0,
    currentPage: currentPage || 1,
    queryKey,
    loading: false,
    error: null,
  });
}

export function seedHomeStore({ carousel, features, homeProducts, flags }) {
  if (Array.isArray(carousel)) {
    CarouselStore.setState({
      CarouselStoreList: carousel,
      CarouselStoreListLoading: false,
      CarouselStoreListError: null,
    });
  }
  if (Array.isArray(features)) {
    FeatureStore.setState({
      FeatureStoreList: features,
      FeatureStoreListLoading: false,
      FeatureStoreListError: null,
    });
  }
  if (homeProducts && typeof homeProducts === 'object') {
    useProductStore.setState({ homeProducts, loading: false, error: null });
  }
  if (Array.isArray(flags)) {
    useFlagStore.setState({ flags, loading: false, error: null });
  }
}

export function seedGlobalStore({
  generalInfo,
  colors,
  socialMediaLinks,
  categories,
  subCategories,
  childCategories,
}) {
  if (generalInfo) {
    GeneralInfoStore.setState({
      GeneralInfoList: generalInfo,
      GeneralInfoListLoading: false,
      GeneralInfoListError: null,
    });
  }
  if (colors) {
    useColorStore.setState({ colors, isLoading: false, error: null });
  }
  if (socialMediaLinks) {
    SocialMediaLinkStore.setState({
      socialMediaLinks,
      loading: false,
      error: null,
    });
  }
  if (Array.isArray(categories)) {
    useCategoryStore.setState({ categories, loading: false, error: null });
  }
  if (Array.isArray(subCategories)) {
    useSubCategoryStore.setState({
      subCategories,
      loading: false,
      error: null,
    });
  }
  if (Array.isArray(childCategories)) {
    useChildCategoryStore.setState({
      childCategories,
      loading: false,
      error: null,
    });
  }
}