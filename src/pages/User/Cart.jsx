import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    updating,
    loadCart,
    clearCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    loadCart().catch((err) => {
      console.error("Gagal memuat keranjang:", err);
    });
  }, [loadCart]);

  const getItemDetails = (item) => {
    const product =
      item.product && typeof item.product === "object"
        ? item.product
        : {};

    const image =
      product.image?.url ||
      product.image?.secure_url ||
      product.image ||
      (Array.isArray(product.images)
        ? product.images[0]?.url ||
          product.images[0]?.secure_url ||
          product.images[0]
        : null) ||
      "https://via.placeholder.com/300x300?text=No+Image";

    return {
      id: product._id || item._id,
      name: product.name ?? "Produk Tanpa Nama",
      price: Number(product.price ?? 0),
      quantity: Number(item.quantity ?? 1),
      image,
    };
  };

  const total = useMemo(() => {
    return cart.reduce((sum, rawItem) => {
      const item = getItemDetails(rawItem);
      return sum + item.price * item.quantity;
    }, 0);
  }, [cart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-medium dark:text-white text-gray-600">
          Memuat keranjang...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 dark:text-white pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-6">
          Keranjang Belanja 🛒
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 text-lg mb-6 dark:text-white">
              Keranjang belanja Anda masih kosong.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((rawItem) => {
                const item = getItemDetails(rawItem);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover border"
                      />

                      <div>
                        <h3 className="text-sm font-bold dark:text-white text-gray-800">
                          {item.name}
                        </h3>

                        <p className="text-blue-600 font-semibold mt-2">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <button
             disabled={updating}
             onClick={async () => {
                            try {
                              await decreaseQty(item.id);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-700 font-bold"
                        >
                           -
                        </button>

                        <span className="w-3 text-center font-semibold text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                       disabled={updating}
                        onClick={async () => {
                            try {
                              await increaseQty(item.id);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            await removeFromCart(item.id);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold dark:text-white text-gray-700">
                  Total Belanja
                </span>

                <span className="text-3xl font-bold text-blue-600">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Checkout
                </button>

                <button
                  onClick={clearCart}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
