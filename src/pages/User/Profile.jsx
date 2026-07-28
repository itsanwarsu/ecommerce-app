import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HiShieldCheck,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineBell,
  HiOutlineShoppingCart,
  HiOutlineUserCircle,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import api from "../../api/axios";
import useCartStore from "../../store/cartStore";
import useChatStore from "../../store/chatStore";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const totalUnread = useChatStore((state) => state.getTotalUnread());

  // Ambil data profil dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        // Token tidak valid atau sudah habis
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");

        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    useCartStore.getState().clearCart();
    navigate("/login");
  }

  // Loading saat mengambil data profil
  if (!user) {
    return (
      <div className="flex dark:bg-gray-900 items-center justify-center min-h-screen">
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20 ">
      {/* Judul */}
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-3xl font-bold">Account</h2>

        <div className="flex items-center gap-4">
          <Link to="/chat" className="relative">
            <HiOutlineChatBubbleOvalLeft className="text-2xl" />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </Link>

          <Link to="/notifications">
            <HiOutlineBell className="text-2xl" />
          </Link>

          <Link to="/cart">
            <HiOutlineShoppingCart className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <HiOutlineUserCircle className="text-7xl" />

          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-green-100">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-5 bg-white dark:bg-gray-800 rounded-xl mx-4 shadow">

        {user?.role === "superadmin" && (
          <MenuItem
            onClick={() => navigate("/superadmin")}
            icon={<HiShieldCheck />}
            title="Dashboard Super Admin"
          />
        )}
        <MenuItem
          onClick={() => navigate("/orders")}
          icon={<HiOutlineShoppingBag />}
          title="Pesanan Saya"
        />


        <MenuItem
          icon={<HiOutlineMapPin />}
          title="Alamat"
        />

        <MenuItem
          icon={<HiOutlineCreditCard />}
          title="Metode Pembayaran"
        />

        <MenuItem
          icon={<HiOutlineCog6Tooth />}
          title="Pengaturan"
        />
      </div>

      {/* Logout */}
      <div className="mx-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600"
        >
          <HiOutlineArrowRightOnRectangle className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 border-b last:border-none hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl text-green-600">{icon}</span>
        <span>{title}</span>
      </div>

      <HiOutlineChevronRight className="text-gray-400" />
    </button>
  );
}
