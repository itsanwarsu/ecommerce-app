import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const loginGoogle = async () => {
      try {
        // Ambil token dari URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // Simpan token
        localStorage.setItem("token", token);

        // Ambil data user
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Simpan data user jika diperlukan
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        // Redirect ke Home
        navigate("/");
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    loginGoogle();
  }, [navigate]);

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
