import { create } from "zustand";

const useSearchStore = create((set) => ({
  search: "",
  setSearch: (text) => set({ search: text }),
}));

export default useSearchStore;
