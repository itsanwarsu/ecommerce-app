import useCategoryStore from "../store/categoryStore";

// Daftar semua kategori yang ada di aplikasi kamu
const CATEGORIES = ["All", "Handphone", "Laptop", "Fashion", "Aksesoris"];

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useCategoryStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-none max-w-7xl mx-auto">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
              isActive
                ? "bg-blue-500 dark:bg-gray-800 text-white border-blue-500 shadow-sm"
                : "bg-[#f4f4f4] dark:bg-gray-800 text-gray-700 dark:text-white border-gray-200"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

