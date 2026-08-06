import { create } from "zustand";
import socket from "../api/socket";
import api from "../api/axios";
import useAuthStore from "./authStore";

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

      // Beri tahu backend supaya pesan dari lawan bicara ditandai sudah dibaca,
      // dan lawan bicara dapat notifikasi realtime (centang berubah jadi biru).
      get().markAsRead(conversationId);
    } catch (error) {
      console.error("Fetch messages error:", error);
      set({ messages: [] });
    }
  },

  // Tandai pesan di percakapan ini sebagai sudah dibaca
  markAsRead: async (conversationId) => {
    if (!conversationId) return;
    try {
      await api.patch(`/messages/read/${conversationId}`);
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  },

  // Helper untuk membuka / membuat ruang chat tanpa auto-send pesan
  startOrSelectConversation: async ({ receiverId, productId }) => {
    const { selectConversation } = get();

    try {
      // 1. Dapatkan atau buat room percakapan berdasarkan member (+ konteks produk)
      const conversation = await createConversation({ receiverId, productId });

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

        const updatedUnread = { ...state.unreadMessages };
        delete updatedUnread[conversationId];

        return {
          conversations: updatedConversations,
          selectedConversation: isCurrentSelected ? null : state.selectedConversation,
          messages: isCurrentSelected ? [] : state.messages,
          unreadMessages: updatedUnread,
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

      // Update preview lastMessage + naikkan percakapan ini ke atas list
      set((state) => {
        const idx = state.conversations.findIndex(
          (c) => c._id === selectedConversation._id
        );
        if (idx === -1) return {};

        const updatedConversation = {
          ...state.conversations[idx],
          lastMessage: message,
        };
        const rest = state.conversations.filter(
          (c) => c._id !== selectedConversation._id
        );

        return { conversations: [updatedConversation, ...rest] };
      });

      const currentUser = useAuthStore.getState().user;
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
    socket.off("messagesRead");

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

        // Percakapan ini sedang dibuka -> langsung tandai dibaca juga
        get().markAsRead(conversationId);
      } else {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [conversationId]: (state.unreadMessages[conversationId] || 0) + 1,
          },
        }));
      }

      set((state) => {
        const idx = state.conversations.findIndex((c) => c._id === conversationId);
        if (idx === -1) return {};

        const updatedConversation = {
          ...state.conversations[idx],
          lastMessage: message,
        };
        const rest = state.conversations.filter((c) => c._id !== conversationId);

        return { conversations: [updatedConversation, ...rest] };
      });
    });

    // Lawan bicara baru saja membaca pesan kita -> update centang jadi biru
    socket.on("messagesRead", ({ conversationId, readerId }) => {
      set((state) => {
        const { selectedConversation } = state;
        if (!selectedConversation || selectedConversation._id !== conversationId) {
          return {};
        }

        const updatedMessages = state.messages.map((msg) => {
          const alreadyRead = (msg.readBy || []).some(
            (id) => String(id) === String(readerId)
          );
          if (alreadyRead) return msg;

          return { ...msg, readBy: [...(msg.readBy || []), readerId] };
        });

        return { messages: updatedMessages };
      });
    });
  },

  disconnectSocket: () => {
    socket.removeAllListeners();
    socket.disconnect();
    set({ isConnected: false, onlineUsers: [] });
  },
}));

export default useChatStore;

