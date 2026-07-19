import { useParams, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import products from "../../data/products";
import LocalReviews from "../../components/LocalReviews";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import useRecentStore from "../../store/recentStore";

import "swiper/css";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id } = useParams();
  const { setCurrentProduct } = useOutletContext(); // Ambil fungsi set dari layout
  const addRecentProduct = useRecentStore((state) => state.addRecentProduct);

  const product = products.find(
    (item) => item._id.toString() === id.toString()
  );

  // Satukan semua efek samping (Side Effects) ke dalam satu useEffect saja
  useEffect(() => {
    if (product) {
      // 1. Set product aktif untuk layout
      setCurrentProduct(product);

      // 2. Ambil userId dari localStorage agar data "Terakhir Dilihat" tidak bercampur antar user
      const currentUserRaw = localStorage.getItem("currentUser");
      let userId = "guest";
      
      if (currentUserRaw) {
        try {
          const currentUser = JSON.parse(currentUserRaw);
          userId = currentUser.id || currentUser.username || "guest";
        } catch (e) {
          userId = "guest";
        }
      }

      // 3. Simpan ke store recent sesuai identitas user saat ini
      addRecentProduct(userId, product);
    }

    // Clean up: Bersihkan data saat meninggalkan halaman produk
    return () => setCurrentProduct(null);
  }, [product, setCurrentProduct, addRecentProduct]);

  if (!product) {
    return <h1 className="text-center text-xl mt-10">Product not found</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto p-3 mt-16 pb-28">
      {/* Image Slider */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
      >
        {product.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={product.name}
              className="w-full h-80 object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Harga */}
      <h2 className="text-xl font-bold text-blue-600 mt-3 ml-2">
        Rp{" "}
        <span className="text-2xl">
          {product.price.toLocaleString("id-ID")}
        </span>
      </h2>

      {/* Nama Produk */}
      <h1 className="text-2xl font-bold mt-2 ml-2">{product.name}</h1>

      {/* Deskripsi */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900">Deskripsi Produk</h2>
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-700 text-[15px] leading-8 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* Review Komponen */}
      <LocalReviews productId={product._id} />
    </div>
  );
}

