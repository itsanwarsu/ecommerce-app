import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineCalendarDays,
  HiOutlineReceiptPercent,
  HiOutlineUser,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import useCartStore from "../store/cartStore";

export default function FooterNavbar({ product }) {
  const location = useLocation();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  // Perbaikan deteksi halaman produk agar lebih reliable
  const isProductPage = location.pathname.startsWith("/product/");

  const navItems = [
    { to: "/", icon: HiOutlineHome, label: "Home" },
    { to: "/feed", icon: HiOutlineNewspaper, label: "Feed" },
    { to: "/event", icon: HiOutlineCalendarDays, label: "Event" },
    { to: "/orders", icon: HiOutlineReceiptPercent, label: "Transaksi" },
    { to: "/profile", icon: HiOutlineUser, label: "Akun" },
  ];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    // Opsional: Kamu bisa tambah alert/toast "Berhasil ditambahkan" di sini
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
      {isProductPage ? (
        <div className="flex items-center gap-2 p-3">
          <button
            aria-label="Chat penjual"
            className="w-14 h-14 border rounded-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <HiOutlineChatBubbleOvalLeft className="text-2xl text-gray-700" />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!product}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 active:bg-orange-700 transition-colors"
          >
            Tambah Keranjang
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!product}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            Beli Sekarang
          </button>
        </div>
      ) : (
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            // Perbaikan logika isActive agar sub-halaman tetap membuat menu terlihat aktif
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Icon className="text-2xl" />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </footer>
  );
}

