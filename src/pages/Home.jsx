import { useState, useEffect } from "react";
import FeatureSlider from "../components/Features";
import Banner from "../components/Banner";
import LoginCard from "../components/LoginCard";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function Home() {

const [isLogin, setIsLogin] = useState(false);

useEffect(() => {
  const currentUser = localStorage.getItem("currentUser");
  setIsLogin(!!currentUser);
}, []);


  return (
<>
    <div className=" bg-white text-black mt-[72px]">

    <Banner/>
      
     <FeatureSlider/>
    <div>
{!isLogin &&(
     <LoginCard/>
)}
</div>

<section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Produk Terbaru
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </section>

      <div className="text-center space-y-4">
        
        <h1 className="text-5xl font-bold">
          🛍️ Welcome to ShopEasy
        </h1>

        <p className="text-gray-400">
          Your simple React + Tailwind ecommerce app
        </p>

        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition">
          Start Shopping
        </button>

      </div>

    </div>
</>
  )
}
