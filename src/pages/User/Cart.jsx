import { useNavigate } from "react-router-dom"
import useCartStore from "../../store/cartStore"

export default function Cart() {
  const navigate = useNavigate()
  
  // Mengambil state dan fungsi yang dibutuhkan dari Zustand
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
  const increaseQty = useCartStore((state) => state.increaseQty)
  const decreaseQty = useCartStore((state) => state.decreaseQty)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  // Perbaikan 1: Hitung total dengan mengalikan harga dengan kuantitas
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Cart 🛒</h1>

      {/* Kondisi jika keranjang kosong */}
      {cart.length === 0 ? (
        <div className="text-center py-10 bg-white/5 rounded-lg">
          <p className="text-gray-400 mb-4">Keranjang belanja Anda masih kosong.</p>
          <button 
            onClick={() => navigate("/")} 
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-medium transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <>
          {/* Daftar Item di Keranjang */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item._id} className="bg-white/10 p-4 rounded flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    Rp {item.price.toLocaleString("id-ID")} x {item.quantity || 1}
                  </p>
                </div>

                {/* Kontrol Kuantitas */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => decreaseQty(item._id)}
                    className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity || 1}</span>
                  <button 
                    onClick={() => increaseQty(item._id)}
                    className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 text-red-400 hover:text-red-500 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bagian Total Harga dan Aksi */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl">Total:</span>
              {/* Perbaikan 2: Format titik ditambahkan di sini */}
              <span className="text-2xl font-bold text-blue-400">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition-colors"
              >
                Lanjut ke Checkout
              </button>
              
              <button
                onClick={clearCart}
                className="w-full sm:w-auto bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

