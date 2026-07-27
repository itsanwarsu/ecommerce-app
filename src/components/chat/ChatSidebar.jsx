import useChatStore from "../../store/chatStore";

const ChatSidebar = () => {
  const conversations = useChatStore(
    (state) => state.conversations
  );

  const selectConversation = useChatStore(
    (state) => state.selectConversation
  );

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  return (
    <div className="w-80 border-r bg-white overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b">
        Chat
      </div>

      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          const otherUser = conversation.members.find(
            (member) => member._id !== currentUser?._id
          );

          return (
            <div
              key={conversation._id}
              onClick={() => selectConversation(conversation)}
              className="p-4 border-b cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="font-semibold">
                {otherUser?.name || "Pengguna"}
              </div>

              <div className="text-sm text-gray-500 truncate">
                {conversation.lastMessage || "Belum ada pesan"}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-center text-gray-500">
          Belum ada percakapan
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
