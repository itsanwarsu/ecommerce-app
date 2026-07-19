import { create } from "zustand";

const useTransactionSearchStore = create((set) => ({
  searchTransaction: "",

  setSearchTransaction: (value) =>
    set({ searchTransaction: value }),
}));

export default useTransactionSearchStore;
