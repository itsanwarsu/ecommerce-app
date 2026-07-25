import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProductCard = ({ product }) => {
  // Defensive check jika props product belum dimuat
  if (!product) return null;

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Ambil user yang login
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const isAdmin =
    user &&
    (user.role === "admin" || user.role === "superadmin");

  // Penanganan ID yang fleksibel (_id atau id)
  const productId = product._id || product.id;

  // Penanganan gambar yang aman
  const imageUrl =
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]?.url || product.images[0]
      : product.image?.url || product.image) ||
    "https://via.placeholder.com/300x300?text=No+Image";

  // Hapus Produk
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus produk ini?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${productId}`,)

      alert("Produk berhasil dihapus.");

      // Refresh halaman agar data terbaru tampil
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Gagal menghapus produk."
      );
    }
  };

  return (
    <div className="relative">
      <Link to={`/product/${productId}`} className="block">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">

          {/* Gambar Produk */}
          <div className="relative w-full h-40 flex items-center justify-center p-2 bg-gray-50">
            <img
              src={imageUrl}
              alt={product.name || "Gambar Produk"}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Menu Admin */}
            {isAdmin && (
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
                >
                  ⋮
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border z-50">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/admin/edit-product/${productId}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail Produk */}
          <div className="p-2">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              {product.category || "General"}
            </p>

            <h2 className="font-semibold text-sm mt-0.5 text-gray-800 line-clamp-2 min-h-[2.5rem]">
              {product.name || "Nama Produk"}
            </h2>

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs font-bold text-blue-600">
                Rp {(product.price || 0).toLocaleString("id-ID")}
              </p>

              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-xs">⭐</span>
                <span className="text-xs text-gray-600 font-medium">
                  {product.rating ?? "0"} (
                  {product.review ?? product.numReviews ?? 0})
                </span>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
