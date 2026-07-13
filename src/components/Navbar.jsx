import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore"; // 1. Perbaikan: Hapus kurung kurawal
import { useState } from "react";
import { HiOutlineShoppingCart, HiOutlineChatBubbleOvalLeft, HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const cart = useCartStore((state) => state.cart);

  // 2. Optimasi: Hitung total kuantitas semua barang di keranjang
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-black px-4 py-2 flex justify-between gap-2 shadow-sm z-50">
      <div className="relative w-full max-w-md">
        <HiOutlineMagnifyingGlass
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
        />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <Link to="/chat">
          <HiOutlineChatBubbleOvalLeft className="text-2xl cursor-pointer hover:text-blue-600 transition-colors" />
        </Link>

        <Link to="/cart" className="relative">
          <HiOutlineShoppingCart className="text-2xl cursor-pointer hover:text-blue-600 transition-colors" />
          {/* Menggunakan totalItems agar akurat dengan jumlah barang */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

