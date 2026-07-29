import React from "react";

const MessageBubble = ({ message, currentUser }) => {
  // Parsing sender ID (bisa berupa object populated atau string ID)
  const senderId =
    typeof message.sender === "object"
      ? message.sender._id || message.sender.id
      : message.sender;

  // Cek apakah pesan ini dikirim oleh user yang sedang login
  const isOwnMessage = String(senderId) === String(currentUser);

  // Ambil detail produk jika ada lampiran
  const product = message.productId || message.product;

  return (
    <div
      className={`flex w-full my-1 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] sm:max-w-[65%] rounded-2xl p-3 shadow-sm transition-all ${
          isOwnMessage
            ? "bg-sky-500 text-white rounded-br-none" // Pengirim: Biru Langit Smooth
            : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none" // Penerima: Abu-abu Soft
        }`}
      >
        {/* Lampiran Kartu Produk (jika ada) */}
        {product && (
          <div
            className={`p-2 mb-2 rounded-xl border flex items-center gap-3 ${
              isOwnMessage
                ? "bg-white text-gray-800 border-sky-100"
                : "bg-white text-gray-800 border-gray-200"
            }`}
          >
            <img
              src={product.image?.url || product.image || "/placeholder.png"}
              alt={product.name || "Produk"}
              className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-gray-50 border"
            />
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold line-clamp-1">
                {product.name || "Detail Produk"}
              </p>
              <p className="text-xs font-bold text-sky-600 mt-0.5">
                Rp {Number(product.price || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        {/* Teks Pesan */}
        {message.text && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}

        {/* Jam Kirim Pesan */}
        <div
          className={`text-[10px] mt-1 text-right font-medium ${
            isOwnMessage ? "text-sky-100" : "text-gray-400"
          }`}
        >
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

