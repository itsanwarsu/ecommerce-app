import { Link, useLocation, useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useSearchStore from "../store/searchStore";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import {
  HiArrowLeft,HiOutlineBell,
  HiOutlineShoppingCart,
  HiOutlineMagnifyingGlass,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart) || [];
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);
  const currentUser = useAuthStore((state) => state.user);

  const unreadMessages = useChatStore((state) => state.unreadMessages);
  const totalUnread = Object.values(unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const paths = ["/product", "/wishlist", "/cart", "/chat", "/orders"];
  const isProductPage = paths.some((path) =>
    location.pathname.startsWith(path)
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() && location.pathname !== "/") {
      navigate("/");
    }
  };

  // Menu desktop (isi Sidebar versi inline)
  const DesktopMenu = () => (
    <div className="hidden md:flex items-center gap-5 shrink-0">

     <Link
        to="/notification"
     className="flex items-center gap-1.5 text-gray-700 dark:text-white hover:text-pink-500 transition-colors">
     <HiOutlineBell className="text-2xl dark:text-white" />
        <span className="text-sm font-medium">Notifications</span>
      </Link>

      <Link
        to="/chat"
        className="relative flex items-center gap-1.5 text-gray-700 dark:text-white hover:text-blue-600 transition-colors"
      >
        <HiOutlineChatBubbleOvalLeft className="text-2xl" />
        {totalUnread > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] leading-none font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
        <span className="text-sm font-medium">Chat</span>
      </Link>

      <Link
        to="/wishlist"
        className="flex items-center gap-1.5 text-gray-700 dark:text-white hover:text-pink-500 transition-colors"
      >
        <HiOutlineHeart className="text-2xl text-pink-500" />
        <span className="text-sm font-medium">Wishlist</span>
      </Link>

      <Link
        to="/profile"
        className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-600"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <HiOutlineUserCircle className="text-3xl text-gray-500" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-800 dark:text-white">
          {currentUser?.name || "Guest"}
        </span>
      </Link>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 dark:text-white px-4 md:px-6 py-3 shadow-sm">
      {isProductPage ? (
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Kembali"
            className="p-1 -ml-1 text-gray-700 hover:text-blue-600 dark:text-white transition-colors"
          >
            <HiArrowLeft className="w-6 h-6 cursor-pointer" />
          </button>

          <div className="flex items-center gap-4 md:gap-6">
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

            <DesktopMenu />

            {/* Hamburger hanya tampil di mobile */}
            <div className="md:hidden">
              <Sidebar />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 md:gap-6">
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

          <div className="flex items-center gap-3 md:gap-6 shrink-0">
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

            <DesktopMenu />

            {/* Hamburger hanya tampil di mobile */}
            <div className="md:hidden">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
