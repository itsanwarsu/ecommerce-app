import { create } from "zustand";
import socket from "../api/socket";

import {
  deleteConversationApi,
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
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
  // Conversations
  // =====================
  fetchConversations: async () => {
    try {
      const data = await getConversations();
      set({ conversations: data });
    } catch (error) {
      console.error("Fetch conversations error:", error);
    }
  },

  selectConversation: async (conversation) => {
    // Handling jika conversation null (tombol back ditekan)
    if (!conversation) {
      set({
        selectedConversation: null,
        messages: [],
      });
      return;
    }

    try {
      set({ selectedConversation: conversation });

      const conversationId = conversation._id || conversation.id;
      const response = await getMessages(conversationId);

      // Pastikan format response selalu berupa Array
      let messageList = [];
      if (Array.isArray(response)) {
        messageList = response;
      } else if (response && Array.isArray(response.data)) {
        messageList = response.data;
      } else if (response && Array.isArray(response.messages)) {
        messageList = response.messages;
      }

      set((state) => {
        const updatedUnread = { ...state.unreadMessages };
        delete updatedUnread[conversationId];

        return {
          messages: messageList,
          unreadMessages: updatedUnread,
        };
      });
    } catch (error) {
      console.error("Fetch messages error:", error);
      set({ messages: [] });
    }
  },

  // Helper untuk membuka / membuat ruang chat tanpa auto-send pesan
  startOrSelectConversation: async ({ receiverId }) => {
    const { selectConversation } = get();

    try {
      // 1. Dapatkan atau buat room percakapan berdasarkan member
      const conversation = await createConversation({ receiverId });

      set((state) => {
        const filteredConversations = state.conversations.filter(
          (c) => c._id !== conversation._id
        );

        return {
          conversations: [conversation, ...filteredConversations],
        };
      });

      // 2. Buka percakapan tersebut (tanpa pemicu sendChat otomatis)
      await selectConversation(conversation);

      return conversation;
    } catch (error) {
      console.error("Start conversation error:", error);
    }
  },

  // Delete Conversation Action
  deleteConversation: async (conversationId) => {
    try {
      await deleteConversationApi(conversationId);

      set((state) => {
        const updatedConversations = state.conversations.filter(
          (c) => c._id !== conversationId
        );

        const isCurrentSelected = state.selectedConversation?._id === conversationId;

        return {
          conversations: updatedConversations,
          selectedConversation: isCurrentSelected ? null : state.selectedConversation,
          messages: isCurrentSelected ? [] : state.messages,
        };
      });
    } catch (error) {
      console.error("Delete conversation error:", error);
      throw error;
    }
  },

  // =====================
  // Unread Helper
  // =====================
  getTotalUnread: () => {
    const { unreadMessages } = get();
    return Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);
  },

  // =====================
  // Send Message (Mendukung Objek Text + ProductId)
  // =====================
  sendChat: async (payload) => {
    try {
      const { selectedConversation } = get();
      if (!selectedConversation) return;

      // Parsing payload (bisa berupa string biasa atau objek { text, productId })
      let text = "";
      let productId = null;

      if (typeof payload === "string") {
        text = payload;
      } else if (typeof payload === "object" && payload !== null) {
        text = payload.text || "";
        productId = payload.productId || null;
      }

      if (!text.trim() && !productId) return;

      const message = await sendMessage({
        conversationId: selectedConversation._id,
        text,
        productId,
      });

      set((state) => ({
        messages: [...state.messages, message],
      }));

      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const receiver = selectedConversation.members.find((member) => {
        const memberId = typeof member === "object" ? member._id || member.id : member;
        return String(memberId) !== String(currentUser?._id || currentUser?.id);
      });

      if (receiver) {
        socket.emit("sendMessage", message);
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
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("newMessage", (message) => {
      const { selectedConversation } = get();

      const conversationId =
        typeof message.conversation === "object"
          ? message.conversation._id
          : message.conversation;

      const isOpenConversation =
        selectedConversation && conversationId === selectedConversation._id;

      if (isOpenConversation) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      } else {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [conversationId]: (state.unreadMessages[conversationId] || 0) + 1,
          },
        }));
      }
    });
  },

  disconnectSocket: () => {
    socket.removeAllListeners();
    socket.disconnect();
    set({ isConnected: false, onlineUsers: [] });
  },
}));

export default useChatStore;

