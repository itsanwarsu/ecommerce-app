import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi2";

export default function LoginCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4 mx-4 mt-4">
      <div className="flex items-center gap-4">
        <HiOutlineUserCircle className="text-6xl text-green-600" />

        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            Selamat Datang
          </h2>

          <p className="text-gray-500 text-sm">
            Login untuk melihat pesanan, voucher, dan promo terbaru.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          to="/login"
          className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="flex-1 text-center border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-50"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}
