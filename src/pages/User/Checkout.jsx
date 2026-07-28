import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useOrderStore from "../../store/orderStore";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, loadCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const getItemDetails = (item) => {
    const product =
      item.product && typeof item.product === "object"
        ? item.product
        : {};

    return {
      id: product._id || item._id,
      name: product.name || "Produk",
      price: Number(product.price || 0),
      quantity: Number(item.quantity || 1),
      image:
        product.image?.url ||
        product.image ||
        (Array.isArray(product.images)
          ? product.images[0]
          : "https://via.placeholder.com/100"),
    };
  };

  const total = useMemo(() => {
    return cart.reduce((sum, rawItem) => {
      const item = getItemDetails(rawItem);
      return sum + item.price * item.quantity;
    }, 0);
  }, [cart]);

  // Keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <h2 className="text-3xl font-bold dark:text-white text-gray-800 mb-3">
            Keranjang Kosong
          </h2>

          <p className="text-gray-500 mb-6 dark:text-white">
            Tambahkan produk ke keranjang terlebih dahulu.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!name.trim() || !address.trim()) {
      alert("Harap isi nama dan alamat.");
      return;
    }

    setLoading(true);

    try {
      await createOrder(name, address);

      // Sinkronkan cart dengan backend
      await loadCart();

      // Bersihkan form
      setName("");
      setAddress("");

      navigate("/success");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Pembayaran gagal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-24 pb-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">
          Checkout
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">

          {/* Form */}
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full dark:bg-gray-800 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={4}
              placeholder="Alamat Lengkap"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full dark:bg-gray-800 border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mb-4">
            Ringkasan Pesanan
          </h2>

          <div className="space-y-4">

            {cart.map((rawItem, index) => {
              const item = getItemDetails(rawItem);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border"
                    />

                    <div>

                      <h3 className="font-semibold">
                        {index + 1}. {item.name}
                      </h3>

                      <p className="text-gray-500">
                        Qty : {item.quantity}
                      </p>

                      <p className="text-gray-500">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>

                    </div>

                  </div>

                  <div className="font-bold text-blue-600">
                    Rp{" "}
                    {(item.price * item.quantity).toLocaleString(
                      "id-ID"
                    )}
                  </div>

                </div>
              );
            })}

          </div>

          <hr className="my-6" />

          <div className="flex justify-between items-center">

            <span className="text-xl font-semibold">
              Total Pembayaran
            </span>

            <span className="text-2xl font-bold text-green-600">
              Rp {total.toLocaleString("id-ID")}
            </span>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : (
              "Bayar Sekarang"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
