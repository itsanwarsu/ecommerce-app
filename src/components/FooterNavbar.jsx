import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import useCartStore from "../store/cartStore";

export default function FooterNavbar({ product }) {
  const location = useLocation();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  // Footer hanya tampil di halaman detail produk
  const isProductPage = location.pathname.startsWith("/product/");

  if (!isProductPage) return null;

  const handleChat = () => {
    const sellerId = product?.seller?._id || product?.seller;

    if (!product || !sellerId) {
      console.warn("Data produk atau penjual belum siap.");
      return;
    }

    navigate("/chat", {
      state: {
        productId: product._id,
        sellerId,
      },
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    navigate("/checkout");
  };

  const isBtnDisabled = !product;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t shadow-md z-30">
      <div className="flex items-center gap-2 p-3 max-w-screen-md mx-auto">
        {/* Chat */}
        <button
          onClick={handleChat}
          disabled={isBtnDisabled}
          aria-label="Chat penjual"
          className="w-14 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiOutlineChatBubbleOvalLeft className="text-2xl text-gray-700 dark:text-white" />
        </button>

        {/* Tambah Keranjang */}
        <button
          onClick={handleAddToCart}
          disabled={isBtnDisabled}
          className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 active:bg-orange-700 transition-colors"
        >
          Tambah Keranjang
        </button>

        {/* Beli Sekarang */}
        <button
          onClick={handleBuyNow}
          disabled={isBtnDisabled}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Beli Sekarang
        </button>
      </div>
    </footer>
  );
}

