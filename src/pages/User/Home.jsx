import { useState, useEffect, useMemo } from "react";
import LoginCard from "../../components/LoginCard";
import ProductCard from "../../components/ProductCard";
import CategoryFilter from "../../components/CategoryFilter";

import useRecentStore from "../../store/recentStore";
import useSearchStore from "../../store/searchStore";
import useCategoryStore from "../../store/categoryStore";
import useAuthStore from "../../store/authStore";

import api from "../../api/axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = useSearchStore((state) => state.search);
  const activeCategory = useCategoryStore((state) => state.activeCategory);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const userId =
    user?._id ||
    user?.id ||
    user?.username ||
    "guest";

  const recentByUsers = useRecentStore((state) => state.recentByUsers);
  const syncRecentProducts = useRecentStore(
    (state) => state.syncRecentProducts
  );

  const userRecentProducts = useMemo(() => {
    return recentByUsers[userId] || [];
  }, [recentByUsers, userId]);

  const isSearching = search.trim() !== "";

  // Ambil produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/products");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        setProducts(data);

        // Sinkronkan recent sesuai user yang sedang aktif
        syncRecentProducts(userId, data);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, syncRecentProducts]);

  // Filter produk
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product) => {
      const matchesSearch = (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesCategory =
        !activeCategory ||
        activeCategory === "All" ||
        (product.category || "")
          .toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">
          Memuat produk...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white text-black mt-[65px] min-h-screen">
      {!isSearching && (
        <>
          {!isAuthenticated && <LoginCard />}

          {userRecentProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-4 border-b">
              <h2 className="text-xl font-bold mb-4">
                Terakhir Dilihat
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {userRecentProducts.map((product) => (
                  <div
                    key={`recent-${product._id || product.id}`}
                    className="min-w-[170px] max-w-[170px] flex-shrink-0 snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">
          {isSearching
            ? `Hasil Pencarian untuk "${search}"`
            : "Jelajahi Produk"}
        </h2>

        <div className="mb-6">
          <CategoryFilter />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {isSearching
                  ? `Produk "${search}" tidak ditemukan`
                  : `Belum ada produk di kategori "${activeCategory}"`}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Coba cari kategori atau kata kunci lain.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
