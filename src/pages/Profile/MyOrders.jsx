import useCartStore from "../../store/cartStore";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function MyOrders() {
  const orders = useCartStore((state) => state.orders);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
        <HiOutlineShoppingBag className="text-7xl text-gray-500 mb-4" />

        <h1 className="text-3xl font-bold mb-2">
          Pesanan Saya
        </h1>

        <p className="text-gray-400">
          Kamu belum memiliki pesanan.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-5">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Pesanan Saya
        </h1>

        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 mb-6 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <div>
                <h2 className="text-lg font-bold">
                  Pesanan #{index + 1}
                </h2>

                <p className="text-sm text-gray-400">
                  Status:
                  <span className="text-green-400 ml-2 font-semibold">
                    Berhasil
                  </span>
                </p>
              </div>

              <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                Selesai
              </span>
            </div>

            {/* Informasi Pembeli */}
            <div className="mb-5">
              <h3 className="font-semibold mb-2">
                Informasi Penerima
              </h3>

              <p>
                <span className="font-semibold">Nama:</span>{" "}
                {order.name}
              </p>

              <p>
                <span className="font-semibold">Alamat:</span>{" "}
                {order.address}
              </p>
            </div>

            {/* Produk */}
            <div>
              <h3 className="font-semibold mb-3">
                Produk
              </h3>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b border-slate-700 pb-4"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div>
                        <h4 className="font-semibold">
                          {item.name}
                        </h4>

                        <p className="text-gray-400">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-gray-400">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="font-bold text-green-400">
                      Rp{" "}
                      {(item.price * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
              <span className="text-lg font-bold">
                Total Pembayaran
              </span>

              <span className="text-2xl font-bold text-green-400">
                Rp {order.total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
