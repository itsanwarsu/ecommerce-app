import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  HiShieldCheck,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineBell,
  HiOutlineShoppingCart,
  HiOutlineUserCircle,
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useChatStore from "../../store/chatStore";

export default function Profile() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);

  const totalUnread = useChatStore((state) => state.getTotalUnread());

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();

    useCartStore.getState().clearCart();

    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        Memuat profil...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      {/* Header Atas */}
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-3xl font-bold dark:text-white">
          Account
        </h2>

        <div className="flex items-center gap-4">
          <Link to="/chat" className="relative">
            <HiOutlineChatBubbleOvalLeft className="text-2xl dark:text-white" />

            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </Link>

          <Link to="/notifications">
            <HiOutlineBell className="text-2xl dark:text-white" />
          </Link>

          <Link to="/cart">
            <HiOutlineShoppingCart className="text-2xl dark:text-white" />
          </Link>
        </div>
      </div>

      {/* Profil */}
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <HiOutlineUserCircle className="text-7xl" />

          <div>
            <h1 className="text-xl font-bold">
              {user.name}
            </h1>

            <p className="text-green-100">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-5 bg-white dark:bg-gray-800 rounded-xl mx-4 shadow">

        {user.role === "superadmin" && (
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
          className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition hover:bg-red-600 active:scale-95"
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
      className="w-full flex items-center justify-between px-4 py-4 border-b last:border-none hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl text-green-600">
          {icon}
        </span>

        <span className="dark:text-white">
          {title}
        </span>
      </div>

      <HiOutlineChevronRight className="text-gray-400" />
    </button>
  );
}
