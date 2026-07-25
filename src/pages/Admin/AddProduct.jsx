import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ImageUploader from "../../components/Admin/ImageUploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../validation/productSchema";
import { toast } from "react-toastify";

export default function AddProduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data) => {
    // 1. Validasi Keberadaan Gambar
    if (!image) {
      toast.error("Pilih gambar terlebih dahulu.");
      return;
    }

    // 2. Memastikan state 'image' adalah objek File asli dari input browser
    if (!(image instanceof File)) {
      toast.error("Format file gambar tidak valid. Silakan pilih ulang gambar.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", data.name);
      form.append("description", data.description || "");
      form.append("price", String(data.price));
      form.append("stock", String(data.stock));
      form.append("category", data.category);
      
      // Mengirimkan objek File langsung
      form.append("image", image);

console.log("Token:", localStorage.getItem("token"));

await api.post("/products", form);
      toast.success("Produk berhasil ditambahkan.");

      // Clean up URL Preview dari memori jika berbentuk blob URL
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      reset();
      setImage(null);
      setPreview(null);

      navigate("/admin/product");
} catch (err) {
      console.log("ERROR DETAIL:", err.response?.data);
      toast.error(
        err.response?.data?.error || err.response?.data?.message || "Terjadi kesalahan saat menambah produk."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Produk</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              placeholder="Nama Produk"
              className="input w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Deskripsi Produk"
              className="input w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="input w-full"
              placeholder="Harga"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="input w-full"
              placeholder="Stok"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <select {...register("category")} className="input w-full">
              <option value="">Pilih kategori</option>
              <option value="Laptop">Laptop</option>
              <option value="Handphone">Handphone</option>
              <option value="Monitor">Monitor</option>
              <option value="Mouse">Mouse</option>
              <option value="Keyboard">Keyboard</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <ImageUploader
            image={image}
            setImage={setImage}
            preview={preview}
            setPreview={setPreview}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 font-semibold text-white hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Mengupload...
              </>
            ) : (
              "Tambah Produk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

