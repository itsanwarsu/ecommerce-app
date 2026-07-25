import React, { useState, useEffect, useRef } from "react";
import { HiStar } from "react-icons/hi2";

export default function LocalReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");
  const fileInputRef = useRef(null);

  // Ambil currentUser dengan aman
  const currentUser = React.useMemo(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const username =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    "Guest";

  const storageKey = `local_reviews_${productId}`;

  useEffect(() => {
    if (!productId) return;

    try {
      const saved = localStorage.getItem(storageKey);
      setReviews(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error("Gagal membaca ulasan:", e);
      setReviews([]);
    }
  }, [productId, storageKey]);

  // Fungsi untuk mengecilkan ukuran gambar (Resize & Compress) agar tidak melebihi kuota localStorage
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Batasi tipe file hanya gambar
    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize gambar maksimum lebar/tinggi 500px
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi ke format JPEG dengan kualitas 70%
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setImage(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    if (comment.trim().length < 10) {
      alert("Ulasan minimal 10 karakter.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: username,
      rating,
      comment: comment.trim(),
      image,
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    const updatedReviews = [newReview, ...reviews];

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
      setReviews(updatedReviews);

      // Reset form
      setComment("");
      setRating(5);
      setImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (e) {
      alert(
        "Penyimpanan lokal penuh! Coba kirim ulasan tanpa gambar atau hapus memori browser."
      );
      console.error("Quota exceeded error:", e);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, item) => total + (item.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0";

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header Summary */}
      <div className="mb-6 bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Ulasan Pembeli</h2>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <HiStar
                key={star}
                className={`text-xl ${
                  star <= Math.round(Number(averageRating))
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <span className="font-semibold text-gray-800">{averageRating}</span>
          <span className="text-gray-500">({reviews.length} Ulasan)</span>
        </div>
      </div>

      {/* Form Input Ulasan */}
      {!currentUser ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
          <p className="text-yellow-700 font-medium">
            Login terlebih dahulu untuk memberikan ulasan.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border shadow-sm p-4 mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nama
            </label>
            <input
              type="text"
              value={username}
              disabled
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Beri rating ${star}`}
                >
                  <HiStar
                    className={`text-3xl transition-transform hover:scale-110 ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Komentar
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Bagaimana kualitas produk ini? (min. 10 karakter)"
              className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Upload Foto (Opsional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {image && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview Gambar:</p>
                <img
                  src={image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Kirim Ulasan
          </button>
        </form>
      )}

      {/* List Ulasan */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white border rounded-xl">
            Belum ada ulasan untuk produk ini.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                  {review.name ? review.name.charAt(0).toUpperCase() : "G"}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {review.name}
                  </h3>
                  <p className="text-xs text-gray-400">{review.createdAt}</p>

                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`text-sm ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                {review.comment}
              </p>

              {review.image && (
                <img
                  src={review.image}
                  alt="Review attachment"
                  className="mt-3 rounded-lg w-32 h-32 object-cover border"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

