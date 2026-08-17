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

        // Simpan hanya data yang dibutuhkan
const cleanProduct = {
  _id: productId,
  name: product.name,
  price: product.price,
  imageUrl:
    product.imageUrl ||
    product.image?.url ||
    product.image ||
    "",
  category: product.category,
};
        // Masukkan ke urutan pertama, maksimal 4 produk
        const updated = [cleanProduct, ...filtered].slice(0, 4);

        set((state) => ({
          recentByUsers: {
            ...state.recentByUsers,
            [key]: updated,
          },
        }));
      },

      // Sinkronkan recent dengan data terbaru dari database
      syncRecentProducts: (userId, products) => {
        const key = userId || "guest";

        const currentRecents = get().recentByUsers[key] || [];

        // Map produk dari database agar pencarian lebih cepat
        const productMap = new Map(
          products.map((product) => [
            product._id || product.id,
            product,
          ])
        );

        // Hapus produk yang sudah tidak ada dan update data terbaru
        const updated = currentRecents
          .filter((item) => productMap.has(item._id || item.id))
          .map((item) => {
            const latest = productMap.get(item._id || item.id);

            return {
  _id: latest._id || latest.id,
  name: latest.name,
  price: latest.price,
  imageUrl:
    latest.imageUrl ||
    latest.image?.url ||
    latest.image ||
    "",
  category: latest.category,
};
          });

        set((state) => ({
          recentByUsers: {
            ...state.recentByUsers,
            [key]: updated,
          },
        }));
      },

      // Ambil riwayat berdasarkan userId
      getRecentProducts: (userId) => {
        const key = userId || "guest";
        return get().recentByUsers[key] || [];
      },

      // Hapus semua riwayat user tertentu
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
      name: "recent-products-storage",
    }
  )
);

export default useRecentStore;
