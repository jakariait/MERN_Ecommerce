import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const useOrderSummaryStore = create((set, get) => ({
  summaries: null,
  loading: false,
  _inflight: null,

  fetchSummaries: ({ userId, token }) => {
    if (!userId) return Promise.resolve();
    if (get()._inflight) return get()._inflight;

    const promise = axios
      .get(`${apiUrl}/orders-summary/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        set({
          summaries: res.data,
          loading: false,
          _inflight: null,
        });
      })
      .catch((err) => {
        console.error('Failed to fetch order summaries:', err);
        set({ loading: false, _inflight: null });
      });

    set({ loading: true, _inflight: promise });
    return promise;
  },
}));

export default useOrderSummaryStore;
