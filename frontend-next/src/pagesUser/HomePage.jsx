'use client';
import { useEffect } from 'react';
import CarouselStore from '../store/CarouselStore.js';
import FeatureStore from '../store/FeatureStore.js';
import useProductStore from '../store/useProductStore.js';
import ProductCarousel from '../component/componentGeneral/ProductCarousel.jsx';
import Feature from '../component/componentGeneral/Feature.jsx';
import ProductByFlag from '../component/componentGeneral/ProductByFlag.jsx';
import { SITE_NAME } from '../lib/config.js';

const HomePage = () => {
  const { CarouselStoreList, CarouselStoreListRequest } = CarouselStore();
  const { FeatureStoreList, FeatureStoreListRequest } = FeatureStore();
  const { homeProducts, fetchHomeProducts } = useProductStore();

  // Server Components seed these stores before hydration. Only re-fetch when
  // the store is empty (e.g. direct client-side revisit without SSR data).
  useEffect(() => {
    if (!Array.isArray(CarouselStoreList) || CarouselStoreList.length === 0) {
      CarouselStoreListRequest();
    }
  }, [CarouselStoreList, CarouselStoreListRequest]);

  useEffect(() => {
    if (!Array.isArray(FeatureStoreList) || FeatureStoreList.length === 0) {
      FeatureStoreListRequest();
    }
  }, [FeatureStoreList, FeatureStoreListRequest]);

  useEffect(() => {
    if (!homeProducts || Object.keys(homeProducts).length === 0) {
      fetchHomeProducts();
    }
  }, [homeProducts, fetchHomeProducts]);

  return (
    <>
      <h1 className="sr-only">{SITE_NAME} – Premium Clothing &amp; Fashion Store</h1>
      <ProductCarousel />
      <Feature />
      <ProductByFlag />
    </>
  );
};

export default HomePage;
