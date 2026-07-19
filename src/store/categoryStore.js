import { create } from "zustand";

const useCategoryStore = create((set) => ({
  activeCategory: "Semua", // Kategori default
  setActiveCategory: (category) => set({ activeCategory: category }),
}));

export default useCategoryStore;

