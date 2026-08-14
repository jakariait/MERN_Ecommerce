'use client';

// React Router v6/v7 API compatibility shim built on Next.js App Router navigation.
// This module is aliased to `react-router-dom` via next.config.mjs so the existing
// component code keeps working unchanged.
//
// NOTE: we intentionally do NOT use next/navigation's `useSearchParams` here.
// That hook bails out of static generation unless wrapped in a Suspense boundary
// inside the page file (layout-level Suspense does not count), and it is used by
// layout components (HeaderSearch/MenuBar) that cannot live under a page boundary.
// Instead we keep search params in local state synced from window.location.search,
// which is hydration-safe (initial value '' on both server and first client render)
// and reactive to query-only client navigations via a history.pushState patch.

import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  useRouter,
  usePathname,
  useParams as useNextParams,
} from 'next/navigation';

const browserListeners = new Set();
let browserPatched = false;

function notifyBrowserListeners() {
  const search =
    typeof window !== 'undefined' ? window.location.search : '';
  browserListeners.forEach((cb) => cb(search));
}

function subscribeBrowserSearch(cb) {
  if (typeof window === 'undefined') return () => {};
  browserListeners.add(cb);
  if (!browserPatched) {
    browserPatched = true;
    const history = window.history;
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      const res = origPush.apply(this, args);
      notifyBrowserListeners();
      return res;
    };
    history.replaceState = function (...args) {
      const res = origReplace.apply(this, args);
      notifyBrowserListeners();
      return res;
    };
    window.addEventListener('popstate', notifyBrowserListeners);
  }
  return () => {
    browserListeners.delete(cb);
  };
}

function useBrowserSearch() {
  const pathname = usePathname() || '/';
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSearch(window.location.search);
    return subscribeBrowserSearch(setSearch);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSearch(window.location.search);
  }, [pathname]);

  return search;
}

function serializeTo(to) {
  if (typeof to === 'string') return to;
  if (!to) return '/';
  let search = '';
  if (to.search) {
    if (typeof to.search === 'string') {
      search = to.search.startsWith('?') ? to.search : `?${to.search}`;
    } else {
      search = `?${new URLSearchParams(to.search).toString()}`;
    }
  }
  const hash = to.hash ? `#${to.hash}` : '';
  return `${to.pathname || ''}${search}${hash}`;
}

export function Link({
  to,
  href,
  replace,
  state,
  reloadDocument,
  children,
  ...rest
}) {
  const target = href ?? to;
  const resolved = serializeTo(target);
  return (
    <NextLink href={resolved} replace={replace} {...rest}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (to, opts = {}) => {
      if (typeof to === 'number') {
        if (to > 0) router.forward();
        else if (to < 0) router.back();
        return;
      }
      const target = serializeTo(to);
      if (opts.replace) router.replace(target);
      else router.push(target);
    },
    [router],
  );
}

export function useLocation() {
  const pathname = usePathname() || '/';
  const search = useBrowserSearch();
  return {
    pathname,
    search: search ? (search.startsWith('?') ? search : `?${search}`) : '',
    hash: '',
    state: null,
    key: 'default',
  };
}

export function useParams() {
  return useNextParams();
}

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const search = useBrowserSearch();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback(
    (params, options = {}) => {
      let qs = '';
      if (params instanceof URLSearchParams) {
        qs = params.toString();
      } else if (typeof params === 'string') {
        qs = params;
      } else if (params && typeof params === 'object') {
        qs = new URLSearchParams(params).toString();
      }
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (options.replace) router.replace(url);
      else router.push(url);
    },
    [router, pathname],
  );

  return [searchParams, setSearchParams];
}

export function Navigate({ to, replace }) {
  const router = useRouter();
  useEffect(() => {
    const target = serializeTo(to);
    if (replace) router.replace(target);
    else router.push(target);
  }, [to, replace, router]);
  return null;
}

export function Outlet({ children }) {
  return children ?? null;
}

export function BrowserRouter({ children }) {
  return <>{children}</>;
}

export function Routes({ children }) {
  return <>{children}</>;
}

export function Route() {
  return null;
}

export default {
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
  Outlet,
  BrowserRouter,
  Routes,
  Route,
};
