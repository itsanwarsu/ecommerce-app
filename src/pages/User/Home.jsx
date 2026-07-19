import { useState, useEffect } from "react";
import LoginCard from "../../components/LoginCard";
import ProductCard from "../../components/ProductCard";
import CategoryFilter from "../../components/CategoryFilter"; 
import products from "../../data/products";
import useRecentStore from "../../store/recentStore"; // Import store recent yang baru
import useSearchStore from "../../store/searchStore";
import useCategoryStore from "../../store/categoryStore"; 

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState("guest"); // Simpan userId aktif di state lokal

  const search = useSearchStore((state) => state.search);
  const activeCategory = useCategoryStore((state) => state.activeCategory); 
  
  // 1. Ambil data map recentByUsers dari store
  const recentByUsers = useRecentStore((state) => state.recentByUsers);
  
  // 2. Ambil list produk terakhir dilihat khusus untuk user yang sedang aktif
  const userRecentProducts = recentByUsers[userId] || [];

  const isSearching = search.trim() !== "";

  // Filter produk berdasarkan Pencarian DAN Kategori sekaligus
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Ambil data user yang sedang login saat komponen dipasang (mount)
  useEffect(() => {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (currentUserRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw);
        setIsLogin(true);
        // Gunakan id atau username unik milik user, fallback ke "guest"
        setUserId(currentUser.id || currentUser.username || "guest");
      } catch (e) {
        setIsLogin(false);
        setUserId("guest");
      }
    } else {
      setIsLogin(false);
      setUserId("guest");
    }
  }, []);

  return (
    <div className="bg-white text-black mt-[72px] min-h-screen">

      {/* KONDISI 1: JIKA USER TIDAK SEDANG MENCARI (Tampilan Home Normal) */}
      {!isSearching && (
        <>
          {!isLogin && <LoginCard />}

          {/* Section: Terakhir Dilihat (Hanya muncul jika ada produk yang pernah dilihat oleh user aktif) */}
          {userRecentProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-4 border-b">
              <h2 className="text-xl font-bold mb-4">Terakhir Dilihat</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {userRecentProducts.map((product) => (
                  <ProductCard key={`recent-${product._id}`} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* KONDISI 2: DAFTAR PRODUK & FILTER KATEGORI */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">
          {isSearching ? `Hasil Pencarian untuk "${search}"` : "Jelajahi Produk"}
        </h2>

        {/* Tampilkan Barisan Tombol Kategori */}
        <div className="mb-6">
          <CategoryFilter />
        </div>

        {/* Grid Produk Hasil Filter */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {isSearching
                  ? `Produk "${search}" tidak ditemukan di kategori "${activeCategory}"`
                  : `Belum ada produk di kategori "${activeCategory}"`}
              </p>
              <p className="text-gray-400 text-sm mt-1">Coba cari kategori atau kata kunci lain.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

