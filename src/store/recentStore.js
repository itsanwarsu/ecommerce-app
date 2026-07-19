import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRecentStore = create(
  persist(
    (set, get) => ({
      // Kita simpan dalam bentuk objek: { "userId_1": [produk, produk], "guest": [produk] }
      recentByUsers: {},

      // Fungsi untuk menambahkan produk terakhir dilihat untuk user tertentu
      addRecentProduct: (userId, product) => {
        // Jika tidak ada userId (user belum login), gunakan fallback 'guest'
        const key = userId || "guest";
        const currentRecents = get().recentByUsers[key] || [];

        // Hapus duplikasi jika produk ini sebelumnya sudah pernah dilihat
        const filtered = currentRecents.filter((item) => item._id !== product._id);

        // Masukkan produk baru di paling depan (maksimal simpan 4 produk saja)
        const updated = [product, ...filtered].slice(0, 4);

        set((state) => ({
          recentByUsers: {
            ...state.recentByUsers,
            [key]: updated,
          },
        }));
      },

      // Fungsi helper untuk mengambil produk berdasarkan userId aktif
      getRecentProducts: (userId) => {
        const key = userId || "guest";
        return get().recentByUsers[key] || [];
      },

      // Opsional: Hapus riwayat jika user logout/ingin bersih-bersih
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

