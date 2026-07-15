import React, { useState, useEffect } from "react";
import { HiStar } from "react-icons/hi2";

export default function LocalReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const username =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    "Guest";

  const storageKey = `local_reviews_${productId}`;

  useEffect(() => {
    if (!productId) return;

    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      setReviews([]);
    }
  }, [productId]);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
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
      comment,
      image,
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedReviews)
    );

    setComment("");
    setRating(5);
    setImage("");
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, item) => total + item.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="max-w-2xl mx-auto p-4">

      <div className="mb-6 bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-2xl font-bold">
          Ulasan Pembeli
        </h2>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {[1,2,3,4,5].map((star)=>(
              <HiStar
                key={star}
                className={`text-xl ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <span className="font-semibold">
            {averageRating}
          </span>

          <span className="text-gray-500">
            ({reviews.length} Ulasan)
          </span>
        </div>
      </div>

      {!currentUser ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
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
            <label className="block text-sm font-medium mb-2">
              Nama
            </label>

            <input
              type="text"
              value={username}
              disabled
              className="w-full border rounded-lg p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rating
            </label>

            <div className="flex gap-2">

              {[1,2,3,4,5].map((star)=>(
                <button
                  key={star}
                  type="button"
                  onClick={()=>setRating(star)}
                >
                  <HiStar
                    className={`text-3xl transition ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}

            </div>
          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Komentar
            </label>

            <textarea
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              rows={4}
              placeholder="Bagaimana kualitas produk ini?"
              className="w-full border rounded-lg p-3 resize-none"
            />

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Upload Foto (Opsional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Kirim Ulasan
          </button>

        </form>
      )}

      <div className="space-y-4">

        {reviews.length === 0 ? (

          <div className="text-center py-8 text-gray-500">
            Belum ada ulasan.
          </div>

        ) : (

          reviews.map((review)=>(

            <div
              key={review.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">

                  {review.name.charAt(0).toUpperCase()}

                </div>

                <div>

                  <h3 className="font-semibold">
                    {review.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {review.createdAt}
                  </p>

                  <div className="flex mt-1">

                    {[1,2,3,4,5].map((star)=>(

                      <HiStar
                        key={star}
                        className={`${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />

                    ))}

                  </div>

                </div>

              </div>

              <p className="mt-4 text-gray-700">
                {review.comment}
              </p>

              {review.image && (

                <img
                  src={review.image}
                  alt="Review"
                  className="mt-4 rounded-lg w-36 h-36 object-cover border"
                />

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}
