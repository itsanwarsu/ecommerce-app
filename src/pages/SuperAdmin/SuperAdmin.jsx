import { useNavigate } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";

export default function SuperAdmin() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  function logout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  const menus = [
    {
      title: "Kelola User",
      icon: <HiOutlineUsers />,
      path: "/superadmin/users",
    },
    {
      title: "Kelola Admin",
      icon: <HiOutlineUsers />,
      path: "/superadmin/admins",
    },
    {
      title: "Produk",
      icon: <HiOutlineCube />,
      path: "/superadmin/products",
    },
    {
      title: "Pesanan",
      icon: <HiOutlineShoppingBag />,
      path: "/superadmin/orders",
    },
    {
      title: "Analytics",
      icon: <HiOutlineChartBar />,
      path: "/superadmin/analytics",
    },
    {
      title: "Pengaturan",
      icon: <HiOutlineCog6Tooth />,
      path: "/superadmin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-green-600 text-white p-5 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Super Admin Dashboard
          </h1>

          <p className="text-sm">
            {currentUser?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg"
        >
          <HiOutlineArrowRightOnRectangle />
          Logout
        </button>

      </header>


      {/* Content */}
      <main className="p-6">

        <h2 className="text-xl font-bold mb-5">
          Management System
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {menus.map((menu, index) => (
            <div
              key={index}
              onClick={() => navigate(menu.path)}
              className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition"
            >

              <div className="text-4xl text-green-600 mb-4">
                {menu.icon}
              </div>

              <h3 className="font-bold text-lg">
                {menu.title}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Kelola {menu.title.toLowerCase()}
              </p>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}
