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
  if (!product) return;

  navigate("/chat", {
    state: {
      productId: product._id,
      sellerId: product.seller?._id || product.seller,
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

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
      <div className="flex items-center gap-2 p-3">
        {/* Chat */}
        <button
          onClick={handleChat}
          disabled={!product}
          aria-label="Chat penjual"
          className="w-14 h-14 border rounded-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <HiOutlineChatBubbleOvalLeft className="text-2xl text-gray-700" />
        </button>

        {/* Tambah Keranjang */}
        <button
          onClick={handleAddToCart}
          disabled={!product}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 active:bg-orange-700 transition-colors"
        >
          Tambah Keranjang
        </button>

        {/* Beli Sekarang */}
        <button
          onClick={handleBuyNow}
          disabled={!product}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Beli Sekarang
        </button>
      </div>
    </footer>
  );
}
