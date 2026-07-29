import useChatStore from "../../store/chatStore";

const ChatSidebar = () => {
  const conversations = useChatStore((state) => state.conversations);
  const selectedConversation = useChatStore((state) => state.selectedConversation);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const deleteConversation = useChatStore((state) => state.deleteConversation);

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  // Ambil ID user saat ini (menangani kemungkinan ._id atau .id)
  const currentUserId = currentUser?._id || currentUser?.id;

  const handleDelete = async (e, conversationId, userName) => {
    // Mencegah percakapan otomatis terpilih saat tombol hapus diklik
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Apakah kamu yakin ingin menghapus percakapan dengan ${userName}?`
    );

    if (confirmDelete) {
      try {
        await deleteConversation(conversationId);
      } catch (error) {
        alert("Gagal menghapus percakapan.");
      }
    }
  };

  return (
    <div className="w-full h-full border-r bg-white flex flex-col">
      <div className="p-4 font-bold text-lg border-b">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conversation) => {
            // Temukan lawan bicara dalam percakapan
            const otherUser = conversation.members?.find((member) => {
              const memberId = typeof member === "object" ? member._id || member.id : member;
              return String(memberId) !== String(currentUserId);
            });

            const userName = otherUser?.name || otherUser?.username || "Pengguna";

            // Ambil teks pesan terakhir (menangani jika berupa Objek atau String)
            const lastMsgText =
              typeof conversation.lastMessage === "object"
                ? conversation.lastMessage?.text
                : conversation.lastMessage;

            // Cek apakah percakapan ini sedang dipilih
            const isSelected = selectedConversation?._id === conversation._id;

            return (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`group relative p-4 border-b cursor-pointer transition flex items-center justify-between ${
                  isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-semibold text-gray-800 truncate">
                    {userName}
                  </div>

                  <div className="text-sm text-gray-500 truncate mt-0.5">
                    {lastMsgText || "Belum ada pesan"}
                  </div>
                </div>

                {/* Tombol Hapus */}
                <button
                  onClick={(e) => handleDelete(e, conversation._id, userName)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-100 md:opacity-0 group-hover:opacity-100"
                  title="Hapus Percakapan"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            Belum ada percakapan
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

