import { useState, useEffect, useCallback, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function Gallery({ images = [], interval = 4000, renderOverlay }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const total = images.length;

  const goTo = useCallback(
    (index) => setCurrent(((index % total) + total) % total),
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    timeoutRef.current = setTimeout(next, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [current, isPaused, interval, next, total]);

  // Reset index kalau jumlah gambar berubah (misal setelah hapus foto terakhir)
  useEffect(() => {
    if (current >= total && total > 0) setCurrent(0);
  }, [total, current]);

  if (total === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
        Belum ada foto di galeri
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={img.id ?? index} className="w-full h-full shrink-0 relative">
            <img
              src={img.url}
              alt={img.caption || `Banner ${index + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm md:text-base font-medium">
                  {img.caption}
                </p>
              </div>
            )}
            {renderOverlay && renderOverlay(img, index)}
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Sebelumnya"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-gray-900/60 dark:hover:bg-gray-900 text-gray-700 dark:text-white rounded-full p-1.5 shadow transition-colors"
          >
            <HiChevronLeft className="text-xl" />
          </button>
          <button
            onClick={next}
            aria-label="Berikutnya"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-gray-900/60 dark:hover:bg-gray-900 text-gray-700 dark:text-white rounded-full p-1.5 shadow transition-colors"
          >
            <HiChevronRight className="text-xl" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Ke slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
