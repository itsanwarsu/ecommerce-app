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
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import Sidebar from "./Sidebar";


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart) || [];
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);

  // Hitung total item di keranjang dengan aman
  const totalItems = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  // Cek apakah sedang berada di halaman Product Detail
const paths = ["/product", "/wishlist", "/cart", "/chat", "/orders",];

const isProductPage = paths.some(path =>
  location.pathname.startsWith(path)
);

  // Handler search: Otomatis arahkan ke Home/Katalog jika user mengetik di halaman lain
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() && location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 dark:text-white px-4 md:px-6 py-3 shadow-sm">
    
      {isProductPage ? (
        <div className="flex items-center justify-between">
          {/* Tombol Kembali */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Kembali"
            className="p-1 -ml-1 text-gray-700 hover:text-blue-600 dark:text-white transition-colors"
          >
            <HiArrowLeft className="w-6 h-6 cursor-pointer" />
          </button>

          {/* Cart + Hamburger */}
          <div className="flex items-center gap-4">         
   <Link
              to="/cart"
              className="relative p-1 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Keranjang Belanja"
            >
              <HiOutlineShoppingCart className="text-2xl dark:text-white cursor-pointer" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          <Sidebar />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 md:gap-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border dark:bg-gray-800 border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Chat + Cart + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">

            <Link
              to="/cart"
              className="relative p-1 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Keranjang Belanja"
            >
              <HiOutlineShoppingCart className="text-2xl dark:text-white cursor-pointer" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
        <Sidebar />
        </div>
        </div>
      )}
    </nav>
  );
}

