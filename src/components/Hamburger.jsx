export default function HamburgerButton() {
  return (
    <button className="group relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition duration-300">
      {/* Garis atas */}
      <span
        className="
          absolute w-6 h-0.5 bg-gray-800 rounded
          -translate-y-2
          transition-all duration-300
          group-hover:translate-y-0
          group-hover:rotate-45
        "
      ></span>

      {/* Garis tengah */}
      <span
        className="
          absolute w-6 h-0.5 bg-gray-800 rounded
          transition-all duration-300
          group-hover:opacity-0
        "
      ></span>

      {/* Garis bawah */}
      <span
        className="
          absolute w-6 h-0.5 bg-gray-800 rounded
          translate-y-2
          transition-all duration-300
          group-hover:translate-y-0
          group-hover:-rotate-45
        "
      ></span>
    </button>
  );
}
