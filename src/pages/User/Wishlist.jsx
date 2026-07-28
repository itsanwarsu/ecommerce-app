import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiHeart, HiTrash } from "react-icons/hi2";
import useWishlistStore from "../../store/wishlistStore";

export default function Wishlist() {
  const {
    wishlist,
    loading,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlistStore();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchWishlist();
    }
  }, [fetchWishlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Memuat wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-16 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <HiHeart className="text-red-500 text-3xl" />
        <h1 className="text-2xl font-bold">
          Wishlist Saya
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
          <HiHeart className="mx-auto text-6xl text-gray-300 mb-4" />

          <h2 className="text-xl font-semibold">
            Wishlist masih kosong
          </h2>

          <p className="text-gray-500 dark:text-white mt-2">
            Tambahkan produk favoritmu ke wishlist.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 text-gray-600 dark:text-white">
            Total Produk :
            <span className="font-semibold ml-2">
              {wishlist.length}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={
                      product.images?.[0]?.url ||
                      product.images?.[0] ||
                      product.image?.url ||
                      product.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-4">
                  <h2 className="font-semibold line-clamp-2 min-h-[48px]">
                    {product.name}
                  </h2>

                  <p className="text-blue-600 font-bold text-lg mt-2">
                    Rp{" "}
                    {(product.price || 0).toLocaleString("id-ID")}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                    >
                      Lihat
                    </Link>

                    <button
                      onClick={() =>
                        removeFromWishlist(product._id)
                      }
                      className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                    >
                      <HiTrash size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
