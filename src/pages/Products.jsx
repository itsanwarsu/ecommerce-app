import { useCartStore } from "../store/cartStore"

export default function Products() {
  const addToCart = useCartStore((state) => state.addToCart)

  const items = [
    { id: 1, name: "Sepatu", price: 200000 },
    { id: 2, name: "Kaos", price: 100000 },
    { id: 3, name: "Jaket", price: 300000 },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white/10 p-4 rounded-xl">
            <h2 className="text-xl">{item.name}</h2>
            <p className="text-gray-300">Rp {item.price}</p>

            <button
              onClick={() => addToCart(item)}
              className="mt-3 px-4 py-2 bg-blue-500 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
