import api from "../api/axios";

// =======================
// Conversation
// =======================

export const createConversation = async (data) => {
  const res = await api.post("/conversations", data);
  return res.data;
};

export const getConversations = async () => {
  const res = await api.get("/conversations");
  return res.data;
};


// =======================
// Message
// =======================

export const getMessages = async (conversationId) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await api.post("/messages", data);
  return res.data;
};
