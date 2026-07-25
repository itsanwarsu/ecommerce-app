import { create } from "zustand";
import api from "../api/axios";

const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,

  // Ambil semua order
  loadOrders: async () => {
    set({ loading: true });

    try {
      const res = await api.get("/orders");

      set({
        orders: Array.isArray(res.data) ? res.data : [],
      });

      return { success: true };
    } catch (err) {
      console.error("Gagal memuat riwayat transaksi:", err);
      set({ orders: [] });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Ambil detail order
  loadOrder: async (orderId) => {
    set({ loading: true });

    try {
      const res = await api.get(`/orders/${orderId}`);

      set({
        currentOrder: res.data,
      });

      return res.data;
    } catch (err) {
      console.error("Gagal mengambil detail transaksi:", err);
      set({ currentOrder: null });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Buat order baru
  createOrder: async (customerName, address) => {
    set({ loading: true });

    try {
      const res = await api.post("/orders", {
        customerName,
        address,
      });

      set((state) => ({
        currentOrder: res.data,
        orders: [res.data, ...state.orders],
      }));

      return res.data;
    } catch (err) {
      console.error("Gagal membuat order:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Hapus order yang sedang dipilih
  clearCurrentOrder: () => {
    set({
      currentOrder: null,
    });
  },
}));

export default useOrderStore;
