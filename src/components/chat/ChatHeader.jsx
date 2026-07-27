import useChatStore from "../../store/chatStore";

const ChatHeader = () => {
  const conversation = useChatStore(
    (state) => state.selectedConversation
  );

  const onlineUsers = useChatStore(
    (state) => state.onlineUsers
  );

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  if (!conversation) {
    return (
      <div className="h-16 border-b flex items-center px-5 bg-white">
        <span className="text-gray-500">
          Pilih percakapan
        </span>
      </div>
    );
  }

  const otherUser = conversation.members.find(
    (member) => member._id !== currentUser?._id
  );

  const online = otherUser
    ? onlineUsers.includes(otherUser._id)
    : false;

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-5">
      <div>
        <h2 className="font-semibold text-lg">
          {otherUser?.name || "Pengguna"}
        </h2>

        <p
          className={`text-sm ${
            online ? "text-green-600" : "text-gray-500"
          }`}
        >
          {online ? "🟢 Online" : "⚪ Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
