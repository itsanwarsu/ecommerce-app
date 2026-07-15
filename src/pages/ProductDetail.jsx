import { useParams, useOutletContext } from "react-router-dom"; // <-- Tambah useOutletContext
import { useEffect } from "react"; // <-- Tambah useEffect
import products from "../data/products";
import LocalReviews from "../components/LocalReviews";

export default function ProductDetail() {
  const { id } = useParams();
  const { setCurrentProduct } = useOutletContext(); // <-- Ambil fungsi set dari layout

  const product = products.find(
    (item) => item._id.toString() === id.toString()
  );

  // Kirim data produk ke MainLayout saat halaman ini dibuka
  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
    }
    // Bersihkan data saat meninggalkan halaman produk
    return () => setCurrentProduct(null);
  }, [product, setCurrentProduct]);

  if (!product) {
    return <h1 className="text-center text-xl mt-10">Product not found</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto p-3 mt-16 pb-28">
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-w-md rounded-lg shadow"
      />

      <h2 className="text-xl font-bold text-blue-600 mt-3 ml-2">
        Rp <span className="text-2xl">
        {product.price.toLocaleString("id-ID")}
      </span></h2>

      <h1 className="text-2xl font-bold mt-2 ml-2">
        {product.name}
      </h1>

      <p className="text-gray-500 ml-2 mb-4">{product.category}</p>

      <LocalReviews productId={product._id}/>
      {/* ⚠️ JANGAN render <FooterNavbar /> di sini lagi agar tidak dobel! */}
    </div>
  );
}

