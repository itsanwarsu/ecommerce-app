const MessageBubble = ({ message, currentUser }) => {
  const senderId =
    typeof message.sender === "object"
      ? message.sender?._id
      : message.sender;

  const mine = senderId === currentUser;
  const product = message.product;

  return (
    <div
      className={`flex mb-3 ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${
          mine
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 border border-gray-200"
        }`}
      >
        {/* Render Kartu Lampiran Produk Jika Pesan Ini Memiliki Produk */}
        {product && (
          <div className="mb-2 p-2 bg-white text-gray-900 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <img
              src={product.image?.url || product.image || "/placeholder.png"}
              alt={product.name || "Produk"}
              className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs truncate">
                {product.name || "Nama produk tidak tersedia"}
              </p>
              <p className="text-blue-600 font-bold text-xs mt-0.5">
                Rp {Number(product.price || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        {/* Teks Pesan */}
        {message.text && (
          <p className="break-words text-sm">{message.text}</p>
        )}

        {/* Waktu Kirim Pesan */}
        <div
          className={`mt-1 text-[10px] text-right ${
            mine ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
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

