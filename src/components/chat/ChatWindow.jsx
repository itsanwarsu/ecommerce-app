import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import useChatStore from "../../store/chatStore";
import useAuthStore from "../../store/authStore";

const ChatWindow = ({ initialProductId }) => {
  const messagesEndRef = useRef(null);
  
  const messages = useChatStore((state) => state.messages);
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  // Ambil user login dari authStore, bukan localStorage manual
  const currentUserData = useAuthStore((state) => state.user);
  const currentUserId = currentUserData?._id || currentUserData?.id;

  // Auto Scroll ke pesan paling bawah setiap kali messages bertambah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-base font-medium">Pilih percakapan untuk memulai chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message._id || message.id}
              message={message}
              currentUser={currentUserId}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
            Belum ada pesan. Mulai percakapan sekarang.
          </div>
        )}
        {/* Element jangkar untuk auto scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Teruskan initialProductId ke ChatInput sebagai draft */}
      <ChatInput initialProductId={initialProductId} />
    </div>
  );
};

export default ChatWindow;
