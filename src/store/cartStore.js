import { create } from "zustand";
import api from "../api/axios";

// Helper untuk mengambil items dari response backend
const getCartItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const useCartStore = create((set) => ({
  cart: [],
  loading: false,
  updating: false,

  // Load keranjang
  loadCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/cart");
      set({ cart: getCartItems(res.data) });
      return { success: true };
    } catch (err) {
      console.error("Gagal memuat keranjang:", err);
      set({ cart: [] });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Tambah produk baru ke keranjang
  addToCart: async (productOrId, quantity = 1) => {
    set({ updating: true });
    try {
      // Ambil ID jika yang dikirim adalah objek, atau gunakan nilai langsung jika string
      const productId = typeof productOrId === "object" 
        ? (productOrId._id || productOrId.id) 
        : productOrId;

      const res = await api.post("/cart", { productId, quantity });
      set({ cart: getCartItems(res.data) });
      return { success: true };
    } catch (err) {
      console.error("Gagal menambah ke keranjang:", err);
      throw err;
    } finally {
      set({ updating: false });
    }
  },

  // Hapus produk
  removeFromCart: async (productId) => {
    set({ updating: true });
    try {
      const res = await api.delete(`/cart/${productId}`);
      set({ cart: getCartItems(res.data) });
      return { success: true };
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      throw err;
    } finally {
      set({ updating: false });
    }
  },

  // Tambah jumlah (FIXED: try-catch & return ditambahkan)
  increaseQty: async (productId) => {
    set({ updating: true });
    try {
      const res = await api.patch(`/cart/increase/${productId}`);
      set({ cart: getCartItems(res.data) });
      return { success: true };
    } catch (err) {
      console.error("Gagal menambah jumlah produk:", err);
      throw err;
    } finally {
      set({ updating: false });
    }
  },

  // Kurangi jumlah
  decreaseQty: async (productId) => {
    set({ updating: true });
    try {
      const res = await api.patch(`/cart/decrease/${productId}`);
      set({ cart: getCartItems(res.data) });
      return { success: true };
    } catch (err) {
      console.error("Gagal mengurangi jumlah produk:", err);
      throw err;
    } finally {
      set({ updating: false });
    }
  },

  // Kosongkan keranjang lokal
  clearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;
