import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
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
import useCartStore from "../../store/cartStore";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    useCartStore.getState().loadUserData();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 pb-20 ">
      {/* Judul */}
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-3xl font-bold">Account</h2>

        <div className="flex items-center gap-4">
          <Link to="/chat">
            <HiOutlineChatBubbleOvalLeft className="text-2xl" />
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
      <div className="mt-5 bg-white rounded-xl mx-4 shadow">
        <MenuItem
          onClick={() => navigate("/orders")}
          icon={<HiOutlineShoppingBag />}
          title="Pesanan Saya"
        />

        <MenuItem
          icon={<HiOutlineHeart />}
          title="Wishlist"
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
