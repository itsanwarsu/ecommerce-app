import useChatStore from "../../store/chatStore";
import useAuthStore from "../../store/authStore";

const ChatSidebar = () => {
  const conversations = useChatStore((state) => state.conversations);
  const selectedConversation = useChatStore((state) => state.selectedConversation);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const deleteConversation = useChatStore((state) => state.deleteConversation);
  const unreadMessages = useChatStore((state) => state.unreadMessages);

  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  const handleDelete = async (e, conversationId, userName) => {
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
    <div className="w-full h-full border-r dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 font-bold text-lg border-b dark:border-gray-700 dark:text-white">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conversation) => {
            const otherUser = conversation.members?.find((member) => {
              const memberId = typeof member === "object" ? member._id || member.id : member;
              return String(memberId) !== String(currentUserId);
            });
            const userName = otherUser?.name || otherUser?.username || "Pengguna";
            const lastMsgText =
              typeof conversation.lastMessage === "object"
                ? conversation.lastMessage?.text
                : conversation.lastMessage;
            const isSelected = selectedConversation?._id === conversation._id;
            const unreadCount = unreadMessages[conversation._id] || 0;
            const hasUnread = unreadCount > 0;

            return (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`group relative p-4 border-b dark:border-gray-800 cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40 border-l-4 border-l-blue-600"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div
                    className={`truncate ${
                      hasUnread
                        ? "font-bold text-gray-900 dark:text-white"
                        : "font-semibold text-gray-800 dark:text-white"
                    }`}
                  >
                    {userName}
                  </div>
                  <div
                    className={`text-sm truncate mt-0.5 ${
                      hasUnread
                        ? "text-gray-800 dark:text-gray-200 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {lastMsgText || "Belum ada pesan"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasUnread && (
                    <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}

                  <button
                    onClick={(e) => handleDelete(e, conversation._id, userName)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition opacity-100 md:opacity-0 group-hover:opacity-100"
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
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Belum ada percakapan
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
