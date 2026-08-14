// Drop-in replacement for zustand's `create` that reads `getState()` (not
// `getInitialState()`) as the `useSyncExternalStore` server snapshot.
// zustand v5's hook returns store-creation defaults during SSR, which prevents
// server-rendered content; using getState() lets seeded data render.
//
// NOTE: intentionally no `'use client'` directive so store modules stay usable
// from both Server Components (for store seeding) and Client Components. The
// hook is accessed via the React namespace so this module is not treated as a
// client-only hook module by the bundler.

import React from 'react';
import { createStore } from 'zustand/vanilla';

const identity = (arg) => arg;

function useStore(api, selector = identity) {
  return React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(() => selector(api.getState()), [api, selector]),
    React.useCallback(() => selector(api.getState()), [api, selector]),
  );
}

const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};

export const create = ((createState) =>
  createState ? createImpl(createState) : createImpl);
