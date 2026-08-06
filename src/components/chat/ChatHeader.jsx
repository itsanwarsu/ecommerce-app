import useChatStore from "../../store/chatStore";
import useAuthStore from "../../store/authStore";

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

  // Ambil user login dari authStore (Zustand), bukan localStorage manual,
  // supaya selalu sinkron dan reactive terhadap login/logout.
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  if (!conversation) {
    return (
      <div className="h-16 border-b dark:border-gray-700 flex items-center px-5 bg-white dark:bg-gray-800">
        <span className="text-gray-500 dark:text-gray-400">
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
    <div className="h-16 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4 md:px-5">
      <div className="flex items-center gap-3">
        {/* Tombol Kembali (Hanya tampil di Layar Mobile: md:hidden) */}
        <button
          onClick={() => selectConversation(null)}
          className="md:hidden p-1.5 -ml-1 dark:text-white text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
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
          <h2 className="font-semibold text-base md:text-lg leading-tight dark:text-white">
            {otherUser?.name || otherUser?.username || "Pengguna"}
          </h2>

          <p
            className={`text-xs md:text-sm font-medium ${
              online ? "text-green-600 dark:text-green-400" : "text-gray-400"
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
