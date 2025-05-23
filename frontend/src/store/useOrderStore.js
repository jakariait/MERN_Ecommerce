import { create } from "zustand";
import axios from "axios";
import useAuthAdminStore from "./AuthAdminStore.js";

const apiUrl = import.meta.env.VITE_API_URL;

const useOrderStore = create((set, get) => ({
  // Status-wise orders and totals
  orderListByStatus: {
    pending: [],
    approved: [],
    intransit: [],
    delivered: [],
    returned: [],
    cancelled: [],
  },
  totalByStatus: {
    pending: 0,
    approved: 0,
    intransit: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
  },

  // All orders regardless of status
  allOrders: [],
  totalOrders: 0,

  // Common loading/error state
  orderListLoading: false,
  orderListError: null,

  // Fetch orders by status or all
  // fetchAllOrders: async (status = "") => {
  //   const token = useAuthAdminStore.getState().token;
  //
  //   set({ orderListLoading: true, orderListError: null });
  //
  //   try {
  //     const res = await axios.get(`${apiUrl}/orders`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: status ? { orderStatus: status } : {},
  //     });
  //
  //     if (res.data.success) {
  //       const { orders, totalOrders } = res.data;
  //
  //       if (status) {
  //         set((state) => ({
  //           orderListByStatus: {
  //             ...state.orderListByStatus,
  //             [status]: orders || [],
  //           },
  //           totalByStatus: {
  //             ...state.totalByStatus,
  //             [status]: totalOrders || 0,
  //           },
  //           orderListLoading: false,
  //         }));
  //       } else {
  //         // Storing all orders without filtering
  //         set({
  //           allOrders: orders || [],
  //           totalOrders: totalOrders || 0,
  //           orderListLoading: false,
  //         });
  //       }
  //     } else {
  //       set({
  //         orderListError: "Failed to fetch orders",
  //         orderListLoading: false,
  //       });
  //     }
  //   } catch (error) {
  //     set({
  //       orderListError:
  //         error.response?.data?.message || "Failed to fetch orders",
  //       orderListLoading: false,
  //     });
  //   }
  // },

  fetchAllOrders: async (status = "", page = 1, limit = 10) => {
    const token = useAuthAdminStore.getState().token;

    set({ orderListLoading: true, orderListError: null });

    try {
      const res = await axios.get(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...(status && { orderStatus: status }),
          page,
          limit,
        },
      });

      if (res.data.success) {
        const { orders, totalOrders, totalPages, currentPage } = res.data;

        if (status) {
          set((state) => ({
            orderListByStatus: {
              ...state.orderListByStatus,
              [status]: orders || [],
            },
            totalByStatus: {
              ...state.totalByStatus,
              [status]: totalOrders || 0,
            },
            orderListLoading: false,
          }));
        } else {
          set({
            allOrders: orders || [],
            totalOrders: totalOrders || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            orderListLoading: false,
          });
        }
      } else {
        set({
          orderListError: "Failed to fetch orders",
          orderListLoading: false,
        });
      }
    } catch (error) {
      set({
        orderListError:
          error.response?.data?.message || "Failed to fetch orders",
        orderListLoading: false,
      });
    }
  },

}));

export default useOrderStore;
