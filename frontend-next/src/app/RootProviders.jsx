'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { HydrateGlobal } from '@/lib/store-hydration';
import { setFaviconFromApi } from '@/utils/setFavicon';
import useColorStore from '@/store/ColorStore';
import GeneralInfoStore from '@/store/GeneralInfoStore';
import useAuthUserStore from '@/store/AuthUserStore';
import useCartStore from '@/store/useCartStore';
import ScrollToTop from '@/component/componentGeneral/ScrollToTop';
import ScrollToTopButton from '@/component/componentGeneral/ScrollToTopButton';

export default function RootProviders({ global, children }) {
  useEffect(() => {
    const colors = useColorStore.getState().colors;
    if (colors) {
      const root = document.documentElement;
      root.style.setProperty('--primaryColor', colors.primaryColor);
      root.style.setProperty('--secondaryColor', colors.secondaryColor);
      root.style.setProperty('--tertiaryColor', colors.tertiaryColor);
      root.style.setProperty('--accentColor', colors.accentColor);
    }
  }, []);

  useEffect(() => {
    const info = GeneralInfoStore.getState().GeneralInfoList;
    if (info?.Favicon) {
      setFaviconFromApi(info.Favicon);
    }
  }, []);

  useEffect(() => {
    const initGTM = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_BASE}/getGTM`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data?.isActive && data?.googleTagManagerId) {
          TagManager.initialize({ gtmId: data.googleTagManagerId });
        }
      } catch {
        // fail silently
      }
    };
    initGTM();
  }, []);

  useEffect(() => {
    useAuthUserStore.getState().initialize();
  }, []);

  useEffect(() => {
    useCartStore.getState().hydrateCart();
  }, []);

  return (
    <>
      <HydrateGlobal {...global} />
      <ScrollToTop />
      <ScrollToTopButton />
      <GATracker />
      {children}
    </>
  );
}

function GATracker() {
  const pathname = usePathname();

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const page = pathname + (search ? `?${search.replace(/^\?/, '')}` : '');
    ReactGA.send({ hitType: 'pageview', page });
  }, [pathname]);

  return null;
}