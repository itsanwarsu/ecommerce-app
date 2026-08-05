import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";

import useAuthStore from "./store/authStore";
import useCartStore from "./store/cartStore";

export default function App() {
  const token = useAuthStore((state) => state.token);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    const initializeApp = async () => {
      if (!token) return;

      try {
        await fetchProfile();
        await loadCart();
      } catch (err) {
        console.error(err);
      }
    };

    initializeApp();
  }, [token, fetchProfile, loadCart]);

  return <AppRoutes />;
}
