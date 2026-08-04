import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    const loginGoogle = async () => {
      try {
        // Ambil token dari URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Simpan token ke Zustand + localStorage
        setToken(token);

        // Ambil profile user dari backend
        await fetchProfile();

        // Redirect ke Home
        navigate("/", { replace: true });

      } catch (error) {
        console.error("Google Login Error:", error);

        useAuthStore.getState().logout();

        navigate("/login", { replace: true });
      }
    };

    loginGoogle();
  }, [navigate, setToken, fetchProfile]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        <h2 className="text-xl font-semibold">
          Memproses Login Google...
        </h2>

        <p className="text-gray-500 mt-2">
          Mohon tunggu sebentar.
        </p>
      </div>
    </div>
  );
}
