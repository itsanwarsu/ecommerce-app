import { useNavigate } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import useCartStore from "../../store/cartStore";

export default function Success() {
  const navigate = useNavigate();

  const orders = useCartStore((state) => state.orders);

  const order =
    orders.length > 0 ? orders[orders.length - 1] : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">
            Belum Ada Pesanan
          </h1>

          <button
            onClick={() => navigate("/")}
            className="mt-5 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold"
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        <HiOutlineCheckCircle className="text-7xl text-green-400 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-green-400 mb-2">
          Pembayaran Berhasil 🎉
        </h1>

        <p className="text-gray-300 mb-6">
          Terima kasih telah berbelanja.
        </p>

        <div className="bg-slate-700 rounded-xl p-4 text-left space-y-2">
          <p>
            <span className="font-semibold">Nama:</span> {order.name}
          </p>

          <p>
            <span className="font-semibold">Alamat:</span> {order.address}
          </p>

          <p>
            <span className="font-semibold">Total:</span>{" "}
            <span className="text-green-400 font-bold">
              Rp {order.total.toLocaleString("id-ID")}
            </span>
          </p>

          <p>
            <span className="font-semibold">Status:</span>{" "}
            {order.status || "Berhasil"}
          </p>

          <p>
            <span className="font-semibold">Tanggal:</span>{" "}
            {order.date || "-"}
          </p>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <HiOutlineShoppingBag className="text-xl" />
          Lihat Pesanan Saya
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full border border-gray-600 hover:bg-slate-700 py-3 rounded-xl"
        >
          Lanjut Belanja
        </button>

      </div>
    </div>
  );
}
