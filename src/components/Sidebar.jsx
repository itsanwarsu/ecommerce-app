import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineXMark,
  HiOutlineHeart,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import ThemeToggle from "./ThemeToggle";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const token = useAuthStore((state) => state.token);

  // Hitung langsung dari unreadMessages supaya reactive terhadap perubahan object
  const unreadMessages = useChatStore((state) => state.unreadMessages);
  const totalUnread = Object.values(unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );

  // Ambil profile jika sudah login
  useEffect(() => {
    if (token && !currentUser) {
      fetchProfile();
    }
  }, [token, currentUser, fetchProfile]);

  // Mencegah body ikut scroll saat sidebar terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Tombol Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <HiOutlineBars3 className="text-3xl dark:text-white text-gray-700" />

        {totalUnread > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] leading-none font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <ThemeToggle />

          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <HiOutlineXMark className="text-3xl dark:text-white text-gray-700" />
          </button>
        </div>

        {/* Profile */}
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiOutlineUserCircle className="text-5xl text-gray-500" />
              )}
            </div>

            <div>
              <Link to="/profile">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {currentUser?.name || "Guest"}
                </h3>

                <p className="text-sm text-gray-500">
                  {currentUser?.email || "Silakan login"}
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1">
          <Link
            to="/chat"
            onClick={() => setOpen(false)}
            className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <HiOutlineChatBubbleOvalLeft className="text-2xl dark:text-white text-gray-600" />

            {totalUnread > 0 && (
              <span className="absolute top-2 left-7 bg-red-500 text-white text-[10px] leading-none font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}

            <span className="font-medium">Chat</span>
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <HiOutlineHeart className="text-2xl text-pink-500" />
            <span className="font-medium">Wishlist</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <HiOutlineCog6Tooth className="text-2xl text-gray-600" />
            <span className="font-medium">Pengaturan</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
