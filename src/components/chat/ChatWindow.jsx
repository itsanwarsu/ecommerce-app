import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import useChatStore from "../../store/chatStore";

const ChatWindow = () => {
  const messages = useChatStore((state) => state.messages);
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  const product = selectedConversation?.product;

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  )?._id;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {product && (
          <div className="bg-gray-50 border rounded-xl p-3 flex items-center gap-3 max-w-xs">
            <img
              src={product.image?.url}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover border"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">
                {product.name}
              </h3>

              <p className="text-blue-600 font-bold text-sm">
                Rp{" "}
                {Number(product.price).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Belum ada pesan. Mulai percakapan sekarang.
          </div>
        )}
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatWindow;
