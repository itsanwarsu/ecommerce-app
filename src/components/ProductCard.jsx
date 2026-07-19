import React from 'react';
import { Link } from 'react-router-dom'; // Pastikan ini sudah di-import

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
        
        {/* Gambar Produk */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-40 object-contain"
        />

        {/* Detail Produk */}
        <div className="p-1">
          <p className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">
            {product.category}
          </p>

          <h2 className="font-semibold text-sm mt-1 ml-1 text-gray-800 line-clamp-2">
            {product.name}
          </h2>

          <div className="flex justify-between items-center p-1">
           {/* Harga */}
            <p className="text-xs font-bold text-blue-600">
              Rp {product.price ? product.price.toLocaleString("id-ID") : "0"}
            </p>
        
            {/* Rating */}
            <div className="flex items-center">
              <span className="text-yellow-500 text-xs">⭐</span>
              <span className=" text-xs text-gray-600 font-medium">
                {product.rating} ({product.review})
              </span>
            </div>

          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

