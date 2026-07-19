import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useCartStore from "../store/cartStore";
import useSearchStore from "../store/searchStore";
import {
  HiArrowLeft,
  HiOutlineShoppingCart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import HamburgerButton from "./Hamburger";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);

  // Hitung total item di keranjang
  const totalItems = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  // Cek apakah sedang berada di halaman Product Detail
  const isProductPage = location.pathname.startsWith("/product");


  return (
     
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white px-6 py-3 shadow-sm">

      {isProductPage ? (
        <div className="flex items-center justify-between">

          {/* Tombol Kembali */}
          <button onClick={() => navigate(-1)}>
            <HiArrowLeft className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
          </button>

          {/* Cart + Hamburger */}
          <div className="flex items-center gap-4">

            <Link
              to="/cart"
              className="relative"
              aria-label="Keranjang Belanja"
            >
              <HiOutlineShoppingCart className="text-2xl cursor-pointer hover:text-blue-600 transition-colors" />

              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <HamburgerButton />

          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">

          {/* Search */}
          <div className="relative w-full max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Chat + Cart */}
          <div className="flex items-center gap-5">

            <Link to="/chat" aria-label="Chat">
              <HiOutlineChatBubbleOvalLeft className="text-2xl cursor-pointer hover:text-blue-600 transition-colors" />
            </Link>

            <Link
              to="/cart"
              className="relative"
              aria-label="Keranjang Belanja"
            >
              <HiOutlineShoppingCart className="text-2xl cursor-pointer hover:text-blue-600 transition-colors" />

              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}
