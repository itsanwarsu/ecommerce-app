import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useCartStore from "../store/cartStore"

export default function Checkout() {
  const navigate = useNavigate()
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
const addOrder = useCartStore((state) => state.addOrder);

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  // Perbaikan 1: Kalikan harga barang dengan jumlah (quantity) yang dibeli
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  const handlePayment = () => {
    // Validasi sederhana agar tidak bisa bayar jika form kosong
    if (!name.trim() || !address.trim()) {
      alert("Harap isi nama dan alamat terlebih dahulu!")
      return
    }

    setLoading(true)

    setTimeout(() => {
      const orderData = {
        name,
        address,
        items: [...cart],
        total,
      }

addOrder(orderData);
      clearCart()

      setLoading(false)
      navigate("/success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4 max-w-md">
        <input
          className="w-full p-2 rounded bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Alamat"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="p-4 bg-white/10 rounded flex justify-between items-center">
          <span className="text-gray-400">Total Pembayaran:</span>
          {/* Perbaikan 2: Menambahkan titik mata uang Indonesia */}
          <span className="font-bold text-xl text-green-400">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 font-semibold py-2 rounded transition-colors"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  )
}

