import { create } from "zustand";
import axios from "../api/axios";

const useGalleryStore = create((set, get) => ({
  images: [],
  loading: false,
  error: null,

  fetchImages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/gallery");
      set({ images: res.data, loading: false });
    } catch (err) {
      set({ error: "Gagal memuat galeri", loading: false });
    }
  },

  addImage: async (file, caption, token) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption || "");

    const res = await api.post("/api/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    set({ images: [...get().images, res.data] });
  },

  removeImage: async (id, token) => {
    await api.delete(`/api/gallery/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ images: get().images.filter((img) => img.id !== id) });
  },
}));

export default useGalleryStore;
