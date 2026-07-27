import { create } from "zustand";
import socket from "../api/socket";

import {
  getConversations,
  getMessages,
  sendMessage,
} from "../services/chatService";

const useChatStore = create((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  unreadMessages: {},
  isConnected: false,

  // =====================
  // Conversation
  // =====================
  fetchConversations: async () => {
    try {
      const data = await getConversations();

      set({
        conversations: data,
      });
    } catch (error) {
      console.error("Fetch conversations error:", error);
    }
  },

  selectConversation: async (conversation) => {
    try {
      set({
        selectedConversation: conversation,
      });

      const messages = await getMessages(conversation._id);

      set((state) => {
        const updatedUnread = { ...state.unreadMessages };
        delete updatedUnread[conversation._id];

        return {
          messages,
          unreadMessages: updatedUnread,
        };
      });
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  },

  // =====================
  // Unread Helper
  // =====================
  getTotalUnread: () => {
    const { unreadMessages } = get();
    return Object.values(unreadMessages).reduce(
      (sum, count) => sum + count,
      0
    );
  },

  // =====================
  // Send Message
  // =====================
  sendChat: async (text) => {
    try {
      const { selectedConversation } = get();

      if (!selectedConversation || !text.trim()) return;

      const message = await sendMessage({
        conversationId: selectedConversation._id,
        text,
      });

      set((state) => ({
        messages: [...state.messages, message],
      }));

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      const receiver = selectedConversation.members.find(
        (member) => member._id !== currentUser?._id
      );

      if (receiver) {
        socket.emit("sendMessage", {
          receiverId: receiver._id,
          conversationId: selectedConversation._id,
          text,
        });
      }

      return message;
    } catch (error) {
      console.error("Send message error:", error);
    }
  },

  // =====================
  // Socket Connection
  // =====================
  connectSocket: (userId) => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", userId);

    socket.off("connect");
    socket.off("disconnect");
    socket.off("onlineUsers");
    socket.off("newMessage");

    socket.on("connect", () => {
      set({
        isConnected: true,
      });

      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
      });

      console.log("Socket disconnected");
    });

    socket.on("onlineUsers", (users) => {
      set({
        onlineUsers: users,
      });
    });

    socket.on("newMessage", (message) => {
      const { selectedConversation } = get();

      const conversationId =
        typeof message.conversation === "object"
          ? message.conversation._id
          : message.conversation;

      const isOpenConversation =
        selectedConversation &&
        conversationId === selectedConversation._id;

      if (isOpenConversation) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      } else {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [conversationId]:
              (state.unreadMessages[conversationId] || 0) + 1,
          },
        }));
      }
    });
  },

  // =====================
  // Disconnect Socket
  // =====================
  disconnectSocket: () => {
    socket.removeAllListeners();
    socket.disconnect();

    set({
      isConnected: false,
      onlineUsers: [],
    });
  },
}));

export default useChatStore;
