import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import LocalReviews from "../../components/LocalReviews";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import useRecentStore from "../../store/recentStore";

import "swiper/css";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id } = useParams();

  // Safely extract context untuk mencegah crash jika context null
  const context = useOutletContext() || {};
  const setCurrentProduct = context.setCurrentProduct;

  const addRecentProduct = useRecentStore((state) => state.addRecentProduct);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/${id}`);

        // Mendukung response { product: {...} } maupun langsung {...}
        const productData = res.data.product || res.data;

        setProduct(productData);

        // Set product aktif untuk layout
        if (typeof setCurrentProduct === "function") {
          setCurrentProduct(productData);
        }

        // Ambil userId dari localStorage
        let userId = "guest";
        const currentUserRaw = localStorage.getItem("currentUser");

        if (currentUserRaw) {
          try {
            const currentUser = JSON.parse(currentUserRaw);
            userId =
              currentUser.id ||
              currentUser._id ||
              currentUser.username ||
              "guest";
          } catch (err) {
            userId = "guest";
          }
        }

        // Simpan ke recent product
        addRecentProduct(userId, productData);
      } catch (err) {
        console.error("Gagal mengambil detail produk:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      if (typeof setCurrentProduct === "function") {
        setCurrentProduct(null);
      }
    };
  }, [id, setCurrentProduct, addRecentProduct]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memuat produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h1 className="text-center text-xl text-gray-500 font-medium">
          Produk tidak ditemukan
        </h1>
      </div>
    );
  }

  // Mendukung Cloudinary maupun string URL biasa
  const imageList =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => img.url || img)
      : [
          product.image?.url ||
            product.image ||
            "https://via.placeholder.com/400",
        ];

  return (
    <div className="max-w-6xl mx-auto p-3 mt-16 pb-28">
      {/* Image Slider */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
      >
        {imageList.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={product.name || "Gambar Produk"}
              className="w-full h-80 object-cover p-4"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Harga */}
      <h2 className="text-xl font-bold text-blue-600 mt-4 ml-2">
        Rp{" "}
        <span className="text-2xl">
          {(product.price || 0).toLocaleString("id-ID")}
        </span>
      </h2>

      {/* Nama Produk */}
      <h1 className="text-2xl font-bold mt-1 ml-2 text-gray-900">
        {product.name}
      </h1>

      {/* Deskripsi */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900">
            Deskripsi Produk
          </h2>
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-700 text-[15px] leading-8 whitespace-pre-line">
            {product.description ||
              "Tidak ada deskripsi untuk produk ini."}
          </p>
        </div>
      </div>

      {/* Review */}
      <LocalReviews productId={product._id || product.id} />
    </div>
  );
}
