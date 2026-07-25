import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRecentStore = create(
  persist(
    (set, get) => ({
      // Objek penyimpan: { "userId_1": [produk], "guest": [produk] }
      recentByUsers: {},

      // Tambah produk terakhir dilihat
      addRecentProduct: (userId, product) => {
        if (!product) return;

        const key = userId || "guest";
        const currentRecents = get().recentByUsers[key] || [];

        // Dapatkan ID produk yang konsisten (_id atau id)
        const productId = product._id || product.id;

        // Hapus duplikasi jika produk sudah ada di riwayat
        const filtered = currentRecents.filter(
          (item) => (item._id || item.id) !== productId
        );

        // Hanya simpan properti ringkas yang dibutuhkan UI ProductCard
        const cleanProduct = {
          _id: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        };

        // Masukkan produk ke urutan pertama, maksimal 4 produk
        const updated = [cleanProduct, ...filtered].slice(0, 4);

        set((state) => ({
          recentByUsers: {
            ...state.recentByUsers,
            [key]: updated,
          },
        }));
      },

      // Ambil riwayat produk berdasarkan userId
      getRecentProducts: (userId) => {
        const key = userId || "guest";
        return get().recentByUsers[key] || [];
      },

      // Hapus riwayat untuk userId tertentu
      clearRecentProducts: (userId) => {
        const key = userId || "guest";
        set((state) => ({
          recentByUsers: {
            ...state.recentByUsers,
            [key]: [],
          },
        }));
      },
    }),
    {
      name: "recent-products-storage", // Nama key di LocalStorage
    }
  )
);

export default useRecentStore;

