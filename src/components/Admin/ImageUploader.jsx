import { useRef } from "react";
import { HiOutlinePhotograph, HiTrash, HiUpload } from "react-icons/hi";

const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUploader({
  image,
  setImage,
  preview,
  setPreview,
}) {
  const inputRef = useRef(null);

  const handleSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSelect(file);
    }
    // Reset value agar jika user memilih file yang sama persis, event onChange tetap mentrigger
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleSelect(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* 1 ELEMEN INPUT KUSTOM DILETAK KAN DI LUAR AGAR REF TIDAK BENTROK */}
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-blue-500 transition"
        >
          <div className="flex flex-col items-center text-center">
            <HiOutlinePhotograph className="text-6xl text-gray-400 mb-4" />
            <h2 className="font-semibold text-lg">Upload Gambar Produk</h2>
            <p className="text-gray-500 mt-2">Drag & Drop atau klik di sini</p>
            <p className="text-sm text-gray-400 mt-1">
              JPG • PNG • WEBP (Maks 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-72 object-cover rounded-xl border"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
            >
              <HiUpload />
              Ganti Foto
            </button>

            <button
              type="button"
              onClick={removeImage}
              className="flex-1 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
            >
              <HiTrash />
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

