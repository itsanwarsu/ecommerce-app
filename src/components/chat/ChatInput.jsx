import { useState, useEffect } from "react";
import useChatStore from "../../store/chatStore";
import api from "../../api/axios";

const ChatInput = ({ initialProductId }) => {
  const [text, setText] = useState("");
  const [pendingProduct, setPendingProduct] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

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
    } else {
      // Reset preview lama kalau initialProductId hilang/berubah jadi kosong
      setPendingProduct(null);
    }
  }, [initialProductId]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();

    if (isSending) return; // cegah double-send (spam Enter/klik)
    if (!text.trim() && !pendingProduct) return;

    if (!selectedConversation) {
      alert("Pilih percakapan terlebih dahulu.");
      return;
    }

    const payload = {
      text: text.trim() || "Halo, saya menanyakan tentang produk ini:",
      productId: pendingProduct ? pendingProduct._id || pendingProduct.id : null,
    };

    // Simpan state saat ini supaya bisa di-restore kalau gagal kirim
    const previousText = text;
    const previousProduct = pendingProduct;

    setText("");
    setPendingProduct(null);
    setSendError(null);
    setIsSending(true);

    try {
      await sendChat(payload);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      // Restore supaya user tidak kehilangan pesan yang sudah diketik
      setText(previousText);
      setPendingProduct(previousProduct);
      setSendError("Pesan gagal terkirim. Coba lagi.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      {/* Notifikasi error kirim */}
      {sendError && (
        <div className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
          <span>{sendError}</span>
          <button
            type="button"
            onClick={() => setSendError(null)}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Kartu Preview Produk Draft (Hanya tampil jika ada pendingProduct) */}
      {pendingProduct && (
        <div className="p-2 px-3 bg-blue-50 dark:bg-blue-950/40 border-b dark:border-gray-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={pendingProduct.image?.url || pendingProduct.image || "/placeholder.png"}
              alt={pendingProduct.name}
              className="w-10 h-10 object-cover rounded-lg border dark:border-gray-600 bg-white flex-shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                Lampiran: {pendingProduct.name}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                Rp {Number(pendingProduct.price || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Tombol Batal Lampirkan */}
          <button
            type="button"
            onClick={() => setPendingProduct(null)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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
          className="flex-1 border dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          placeholder="Tulis pesan..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSending}
        />

        <button
          type="submit"
          disabled={(!text.trim() && !pendingProduct) || isSending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          {isSending ? "..." : "Kirim"}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
