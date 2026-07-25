import { useNavigate } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import useOrderStore from "../../store/orderStore";

export default function Success() {
  const navigate = useNavigate();

  const order = useOrderStore((state) => state.currentOrder);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Belum Ada Pesanan
          </h1>

          <p className="text-gray-500 mb-6">
            Kamu belum melakukan checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">

        <div className="flex justify-center">
          <HiOutlineCheckCircle className="text-7xl text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-center text-green-600 mt-4">
          Pesanan Berhasil
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Terima kasih telah berbelanja.
        </p>

        <div className="space-y-3 border rounded-xl p-5 bg-gray-50">

          <div className="flex justify-between">
            <span className="font-medium">Nomor Pesanan</span>
            <span className="font-semibold">
              #{order._id?.slice(-8)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Nama</span>
            <span>{order.customerName}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="font-medium">Alamat</span>

            <span className="text-right">
              {order.address}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Status</span>

            <span className="capitalize text-blue-600 font-semibold">
              {order.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Tanggal</span>

            <span>
              {new Date(order.createdAt).toLocaleString("id-ID")}
            </span>
          </div>

          <hr />

          <div className="flex justify-between text-lg">
            <span className="font-bold">
              Total
            </span>

            <span className="font-bold text-green-600">
              Rp {order.total.toLocaleString("id-ID")}
            </span>
          </div>

        </div>

        <button
          onClick={() => navigate("/orders")}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <HiOutlineShoppingBag className="text-xl" />
          Lihat Pesanan Saya
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold"
        >
          Lanjut Belanja
        </button>

      </div>
    </div>
  );
}
