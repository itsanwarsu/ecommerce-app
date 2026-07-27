import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";

import useChatStore from "../../store/chatStore";
import { createConversation } from "../../services/chatService";

const Chat = () => {
  const location = useLocation();

  const { productId, sellerId } = location.state || {};

  const selectConversation = useChatStore(
    (state) => state.selectConversation
  );

  useEffect(() => {
    const initChat = async () => {
      if (!productId || !sellerId) return;

      try {
        const conversation = await createConversation({
          receiverId: sellerId,
          productId: productId,
        });
        await selectConversation(conversation);
      } catch (err) {
        console.error(err);
      }
    };

    initChat();
  }, [productId, sellerId]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
