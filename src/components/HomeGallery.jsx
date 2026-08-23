import { useEffect, useRef, useState } from "react";
import { HiXMark, HiOutlinePlus } from "react-icons/hi2";
import Gallery from "./Gallery";
import useGalleryStore from "../store/galleryStore";
import useAuthStore from "../store/authStore";

export default function HomeGallery() {
  const { images, loading, fetchImages, addImage, removeImage } = useGalleryStore();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const isSuperadmin = user?.role === "superadmin";

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await addImage(file, "", token);
    } catch (err) {
      console.error(err);
      alert("Gagal upload foto");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    try {
      await removeImage(id, token);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus foto");
    }
  };

  if (loading) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <Gallery
        images={images}
        interval={4000}
        renderOverlay={(img) =>
          isSuperadmin && (
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow z-10"
              aria-label="Hapus foto"
            >
              <HiXMark className="text-lg" />
            </button>
          )
        }
      />

      {isSuperadmin && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow"
          >
            <HiOutlinePlus className="text-lg" />
            {uploading ? "Mengunggah..." : "Tambah Foto"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
