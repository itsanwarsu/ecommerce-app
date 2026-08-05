import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";

export default function MainLayout() {
  const [currentProduct, setCurrentProduct] = useState(null);
  const location = useLocation();

  const hideNavbarRoutes = ["/profile", "/order", "/checkout", "/chat"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const connectSocket = useChatStore((state) => state.connectSocket);
  const disconnectSocket = useChatStore((state) => state.disconnectSocket);
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const userId = user?._id || user?.id;

    if (isAuthenticated && userId) {
      connectSocket(userId);
      fetchConversations();
    }

    return () => disconnectSocket();
  }, [isAuthenticated, user, connectSocket, disconnectSocket, fetchConversations]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {!hideNavbar && <Navbar />}
        <Outlet context={{ setCurrentProduct }} />
        <FooterNavbar product={currentProduct} />
      </div>
    </>
  );
}
