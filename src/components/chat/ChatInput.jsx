import { useState } from "react";
import useChatStore from "../../store/chatStore";

const ChatInput = () => {
  const [text, setText] = useState("");

  const sendChat = useChatStore((state) => state.sendChat);
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  const handleSend = async () => {
    if (!text.trim()) return;

    if (!selectedConversation) {
      alert("Pilih percakapan terlebih dahulu.");
      return;
    }

    await sendChat(text);

    setText("");
  };

  return (
    <div className="border-t p-3 flex gap-2">
      <input
        type="text"
        className="flex-1 border rounded-lg px-3 py-2 outline-none"
        placeholder="Tulis pesan..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
      >
        Kirim
      </button>
    </div>
  );
};

export default ChatInput;
