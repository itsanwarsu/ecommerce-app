import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import useChatStore from "../store/chatStore";

export default function MainLayout() {
  const [currentProduct, setCurrentProduct] = useState(null);
  const location = useLocation();

  const hideNavbarRoutes = ["/profile", "/orders", "/chat", "/cart"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const connectSocket = useChatStore((state) => state.connectSocket);
  const disconnectSocket = useChatStore((state) => state.disconnectSocket);
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (user?._id) {
      connectSocket(user._id);
      fetchConversations();
    }

    return () => disconnectSocket();
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {/* Kita berikan fungsi untuk mengeset produk ke semua halaman anak */}
      <Outlet context={{ setCurrentProduct }} />
      {/* Berikan data produk yang sedang aktif ke FooterNavbar */}
      <FooterNavbar product={currentProduct} />
    </>
  );
}
