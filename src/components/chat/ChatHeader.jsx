import useChatStore from "../../store/chatStore";

const ChatHeader = () => {
  const conversation = useChatStore(
    (state) => state.selectedConversation
  );

  const selectConversation = useChatStore(
    (state) => state.selectConversation
  );

  const onlineUsers = useChatStore(
    (state) => state.onlineUsers
  );

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  const currentUserId = currentUser?._id || currentUser?.id;

  if (!conversation) {
    return (
      <div className="h-16 border-b flex items-center px-5 bg-white">
        <span className="text-gray-500">
          Pilih percakapan
        </span>
      </div>
    );
  }

  // Cari lawan bicara dengan aman (mencegah bug mismatch tipe ID)
  const otherUser = conversation.members?.find((member) => {
    const memberId = typeof member === "object" ? member._id || member.id : member;
    return String(memberId) !== String(currentUserId);
  });

  const otherUserId = typeof otherUser === "object" ? otherUser?._id || otherUser?.id : otherUser;

  // Pastikan perbandingan ID ke array onlineUsers selalu mengonversi ke String
  const online = otherUserId
    ? onlineUsers.some((uId) => String(uId) === String(otherUserId))
    : false;

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-5">
      <div className="flex items-center gap-3">
        {/* Tombol Kembali (Hanya tampil di Layar Mobile: md:hidden) */}
        <button
          onClick={() => selectConversation(null)}
          className="md:hidden p-1.5 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
          title="Kembali ke daftar chat"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div>
          <h2 className="font-semibold text-base md:text-lg leading-tight">
            {otherUser?.name || otherUser?.username || "Pengguna"}
          </h2>

          <p
            className={`text-xs md:text-sm font-medium ${
              online ? "text-green-600" : "text-gray-400"
            }`}
          >
            {online ? "🟢 Online" : "⚪ Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

