import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  return (
<Link to={`/product/${product._id}`}>
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />

      <div className="p-4">
        <p className="text-sm text-gray-500">{product.category}</p>

        <h2 className="font-semibold text-lg mt-1 line-clamp-2">
          {product.name}
        </h2>

        <div className="flex items-center mt-2">
          <span className="text-yellow-500">⭐</span>
          <span className="ml-1 text-sm">
            {product.rating} ({product.review})
          </span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-blue-600">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
