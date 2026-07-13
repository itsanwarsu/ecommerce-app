import { Link } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineCalendarDays,
  HiOutlineReceiptPercent,
  HiOutlineUser,
} from "react-icons/hi2";

export default function FooterNavbar() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md">
      <div className="flex justify-around items-center py-2">

        <Link
          to="/"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <HiOutlineHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/feed"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <HiOutlineNewspaper className="text-2xl" />
          <span className="text-xs">Feed</span>
        </Link>

        <Link
          to="/event"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <HiOutlineCalendarDays className="text-2xl" />
          <span className="text-xs">Event</span>
        </Link>

        <Link
          to="/transaction"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <HiOutlineReceiptPercent className="text-2xl" />
          <span className="text-xs">Transaksi</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <HiOutlineUser className="text-2xl" />
          <span className="text-xs">Akun</span>
        </Link>

      </div>
    </footer>
  );
}
