import { useState, useEffect, useMemo } from "react";
import LoginCard from "../../components/LoginCard";
import ProductCard from "../../components/ProductCard";
import CategoryFilter from "../../components/CategoryFilter";
import useRecentStore from "../../store/recentStore";
import useSearchStore from "../../store/searchStore";
import useCategoryStore from "../../store/categoryStore";
import api from "../../api/axios";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState("guest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = useSearchStore((state) => state.search);
  const activeCategory = useCategoryStore((state) => state.activeCategory);

  const recentByUsers = useRecentStore((state) => state.recentByUsers);
  const userRecentProducts = recentByUsers?.[userId] || [];

  const isSearching = search.trim() !== "";

  // 1. Cek User Login
  useEffect(() => {
    const currentUserRaw = localStorage.getItem("currentUser");

    if (currentUserRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw);
        setIsLogin(true);
        setUserId(
          currentUser._id ||
            currentUser.id ||
            currentUser.username ||
            "guest"
        );
      } catch (err) {
        console.error("Error parsing user:", err);
        setIsLogin(false);
        setUserId("guest");
      }
    } else {
      setIsLogin(false);
      setUserId("guest");
    }
  }, []);

// 2. Ambil produk dari backend
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log(res.data);

      // Safe check: pastikan yang masuk ke state selalu berbentuk Array
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data.products || []);

      setProducts(data);

      // Sinkronkan recent dengan produk yang masih ada di database
      const currentUserRaw = localStorage.getItem("currentUser");
      const currentUser = currentUserRaw
        ? JSON.parse(currentUserRaw)
        : null;

      useRecentStore
        .getState()
        .syncRecentProducts(currentUser?._id, data);

    } catch (err) {
      console.error("Gagal mengambil produk:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  // 3. Filter produk menggunakan useMemo untuk performa
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product) => {
      const matchesSearch = (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesCategory =
        !activeCategory ||
        activeCategory === "All" ||
        (product.category || "").toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Memuat produk...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black mt-[72px] min-h-screen">
      {!isSearching && (
        <>
          {!isLogin && <LoginCard />}

          {userRecentProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-4 border-b">
              <h2 className="text-xl font-bold mb-4">Terakhir Dilihat</h2>

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

