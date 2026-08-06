import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import useChatStore from "../../store/chatStore";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, sellerId } = location.state || {};

  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const selectedConversation = useChatStore((state) => state.selectedConversation);
  const startOrSelectConversation = useChatStore((state) => state.startOrSelectConversation);

  // Simpan kombinasi productId+sellerId terakhir yang sudah di-init,
  // supaya bisa init ulang kalau user chat produk/seller lain,
  // tapi tetap anti double-run untuk kombinasi yang sama (misal StrictMode)
  const lastInitKey = useRef(null);

  // Digabung jadi satu effect: pastikan fetchConversations SELESAI dulu
  // sebelum startOrSelectConversation jalan, supaya percakapan baru yang
  // dibuat tidak ketiban-timpa oleh hasil fetch yang datang belakangan.
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // 1. Load daftar percakapan dulu, dan tunggu sampai selesai
      await fetchConversations();

      if (cancelled) return;

      // 2. Baru setelah itu, kalau masuk dari tombol "Chat Penjual", buat/buka percakapannya
      if (!productId || !sellerId) return;

      const key = `${productId}-${sellerId}`;

      // Sudah pernah di-init untuk kombinasi produk+seller ini, skip
      if (lastInitKey.current === key) return;

      lastInitKey.current = key;

      try {
        await startOrSelectConversation({
          receiverId: sellerId,
          productId: productId,
        });

        if (cancelled) return;

        // Bersihkan location.state dari browser history agar tidak ter-trigger lagi
        navigate(location.pathname, { replace: true, state: {} });
      } catch (err) {
        console.error("Init chat error:", err);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, sellerId, fetchConversations, startOrSelectConversation, navigate, location.pathname]);

  return (
    <div className="h-screen dark:bg-gray-900 bg-gray-100 flex flex-col">
      <div className="flex flex-1 overflow-hidden relative">
        {/*
          1. Sidebar (Daftar Chat)
          Mobile: Jika ada selectedConversation -> hidden, jika tidak -> flex
          Desktop (md:): Selalu tampil sebagai flex (w-80)
        */}
        <div
          className={`w-full md:w-80 h-full ${
            selectedConversation ? "hidden md:flex" : "flex"
          } flex-col border-r dark:border-gray-700 bg-white dark:bg-gray-900`}
        >
          <ChatSidebar />
        </div>

        {/*
          2. ChatWindow (Isi Pesan)
          Mobile: Jika ada selectedConversation -> flex, jika tidak -> hidden
          Desktop (md:): Selalu tampil flex
        */}
        <div
          className={`flex-1 h-full ${
            selectedConversation ? "flex" : "hidden md:flex"
          } flex-col bg-white dark:bg-gray-900`}
        >
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default Chat;
