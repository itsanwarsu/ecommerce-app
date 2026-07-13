import { useParams } from "react-router-dom";
import products from "../data/products";
import useCartStore from "../store/cartStore";

export default function ProductDetail() {
  const { id } = useParams();

  // Amankan pencarian dengan mengubah kedua ID menjadi String (.toString())
  // Ini mengantisipasi jika _id di products.js berbentuk Number maupun String Hexadecimal (MongoDB)
  const product = products.find(
    (item) => item._id.toString() === id.toString()
  );

  if (!product) {
    return <h1 className="text-center text-xl mt-10">Product not found</h1>;
  }

  // Mengambil fungsi addToCart dari Zustand store
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-w-md rounded-lg shadow"
      />

      <h1 className="text-3xl font-bold mt-5">
        {product.name}
      </h1>

      <p className="text-gray-500">{product.category}</p>

      <h2 className="text-2xl font-bold text-blue-600 mt-3">
        Rp {product.price.toLocaleString("id-ID")}
      </h2>

      <button 
        onClick={() => addToCart(product)}  
        className="mt-5 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-3 rounded-lg"
      >
        Add To Cart
      </button>
    </div>
  );
}

