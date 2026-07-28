import { create } from "zustand";

const useCategoryStore = create((set) => ({
  activeCategory: "All", // Kategori default
  setActiveCategory: (category) => set({ activeCategory: category }),
}));

export default useCategoryStore;

