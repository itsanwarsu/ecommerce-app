import { useState, useEffect } from "react";
import useChatStore from "../../store/chatStore";
import api from "../../api/axios";

const ChatInput = ({ initialProductId }) => {
  const [text, setText] = useState("");
  const [pendingProduct, setPendingProduct] = useState(null);

  const sendChat = useChatStore((state) => state.sendChat);
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  // Ambil data produk draft jika ada initialProductId
  useEffect(() => {
    if (initialProductId) {
      api.get(`/products/${initialProductId}`)
        .then((res) => {
          setPendingProduct(res.data.product || res.data);
        })
        .catch((err) => console.error("Gagal mengambil preview produk:", err));
    }
  }, [initialProductId]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();

    if (!text.trim() && !pendingProduct) return;

    if (!selectedConversation) {
      alert("Pilih percakapan terlebih dahulu.");
      return;
    }

    const payload = {
      text: text.trim() || "Halo, saya menanyakan tentang produk ini:",
      productId: pendingProduct ? pendingProduct._id || pendingProduct.id : null,
    };

    setText("");
    setPendingProduct(null); // Clear preview produk setelah dikirim

    try {
      await sendChat(payload);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  return (
    <div className="border-t bg-white flex flex-col">
      {/* Kartu Preview Produk Draft (Hanya tampil jika ada pendingProduct) */}
      {pendingProduct && (
        <div className="p-2 px-3 bg-blue-50 border-b flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={pendingProduct.image?.url || pendingProduct.image || "/placeholder.png"}
              alt={pendingProduct.name}
              className="w-10 h-10 object-cover rounded-lg border bg-white flex-shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-800 truncate">
                Lampiran: {pendingProduct.name}
              </p>
              <p className="text-xs text-blue-600 font-bold">
                Rp {Number(pendingProduct.price || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Tombol Batal Lampirkan */}
          <button
            type="button"
            onClick={() => setPendingProduct(null)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 transition"
            title="Batal Lampirkan Produk"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form Input Pesan */}
      <form onSubmit={handleSend} className="p-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
          placeholder="Tulis pesan..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          disabled={!text.trim() && !pendingProduct}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatInput;

