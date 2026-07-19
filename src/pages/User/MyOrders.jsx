import useCartStore from "../../store/cartStore";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import useTransactionSearchStore from "../../store/transactionSearchStore"; 

export default function MyOrders() {
  // 1. Ambil data dari Store
  const orders = useCartStore((state) => state.orders);
  const searchTransaction = useTransactionSearchStore(
    (state) => state.searchTransaction
  );
  const setSearchTransaction = useTransactionSearchStore(
    (state) => state.setSearchTransaction
  );

  // ==========================================
  // TULIS LOGIKA TERBARU DI SINI (Sebelum Return)
  // ==========================================
  
  // Ambil salinan array orders lalu balik urutannya (terbaru di atas)
  const reversedOrders = [...orders].reverse();

  // Filter data dari array yang sudah dibalik tersebut
  const filteredOrders = reversedOrders.filter((order) => {
    const matchName = order.name.toLowerCase().includes(searchTransaction.toLowerCase());
    const matchProduct = order.items.some((item) =>
      item.name.toLowerCase().includes(searchTransaction.toLowerCase())
    );
    return matchName || matchProduct;
  });

  // ==========================================

  // Sisa kode JSX ke bawahnya tetap sama...

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
        <HiOutlineShoppingBag className="text-7xl text-gray-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pesanan Saya</h1>
        <p className="text-gray-400">Kamu belum memiliki pesanan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-5">
      {/* Container Input Search */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Cari transaksi berdasarkan nama/produk..."
          value={searchTransaction}
          onChange={(e) => setSearchTransaction(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="max-w-4xl mx-auto pb-10">
        <h1 className="text-3xl font-bold mb-6">Pesanan Saya</h1>

        {/* PERBAIKAN 4: Ganti orders.map menjadi filteredOrders.map */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Transaksi tidak ditemukan.</p>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 mb-6 shadow-lg border border-gray-100">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold">Pesanan #{index + 1}</h2>
                  <p className="text-sm text-gray-400">
                    Status: <span className="text-green-500 ml-2 font-semibold">Berhasil</span>
                  </p>
                </div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Selesai
                </span>
              </div>

              {/* Informasi Pembeli */}
              <div className="mb-5">
                <h3 className="font-semibold mb-2">Informasi Penerima</h3>
                <p><span className="font-semibold">Nama:</span> {order.name}</p>
                <p><span className="font-semibold">Alamat:</span> {order.address}</p>
              </div>

              {/* Produk */}
              <div>
                <h3 className="font-semibold mb-3">Produk</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="flex gap-4 items-center">
                        <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                          <p className="text-gray-400">Rp {item.price.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold">Total Pembayaran</span>
                <span className="text-2xl font-bold text-green-600">
                  Rp {order.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

