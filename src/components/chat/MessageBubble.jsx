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

  // Status baca: readBy berisi ID user lain yang sudah membaca pesan ini.
  // Kalau ada entri selain si pengirim sendiri, berarti sudah dibaca lawan bicara.
  const isRead = (message.readBy || []).some((id) => {
    const readerId = typeof id === "object" ? id._id || id.id : id;
    return String(readerId) !== String(senderId);
  });

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
            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none" // Penerima: Abu-abu Soft
        }`}
      >
        {/* Lampiran Kartu Produk (jika ada) */}
        {product && (
          <div
            className={`p-2 mb-2 rounded-xl border flex items-center gap-3 ${
              isOwnMessage
                ? "bg-white text-gray-800 border-sky-100"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600"
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

        {/* Jam Kirim Pesan + Status Baca */}
        <div
          className={`flex items-center gap-1 mt-1 justify-end text-[10px] font-medium ${
            isOwnMessage ? "text-sky-100" : "text-gray-400 dark:text-gray-400"
          }`}
        >
          <span>
            {message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>

          {/* Ikon centang hanya untuk pesan milik sendiri */}
          {isOwnMessage && (
            <span className="inline-flex">
              {isRead ? (
                // Centang ganda biru muda: sudah dibaca
                <svg
                  className="w-3.5 h-3.5 text-cyan-200"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M1 8.5l3 3 5-6"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 8.5l3 3 6-7"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Centang tunggal: terkirim, belum dibaca
                <svg
                  className="w-3.5 h-3.5 text-sky-100/80"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M2 8.5l4 4 8-9"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
