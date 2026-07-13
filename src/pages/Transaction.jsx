import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";

const orders = [
  {
    id: 1,
    product: "ASUS ROG Strix G16",
    price: "Rp18.500.000",
    status: "Dikirim",
    icon: HiOutlineTruck,
  },
  {
    id: 2,
    product: "iPhone 15 Pro",
    price: "Rp16.999.000",
    status: "Belum Bayar",
    icon: HiOutlineClock,
  },
  {
    id: 3,
    product: "Nike Air Force 1",
    price: "Rp1.899.000",
    status: "Selesai",
    icon: HiOutlineCheckCircle,
  },
];

export default function Transaction() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 mt-[72px]">
      {/* Header */}
      <div className="bg-green-600 text-white p-5">
        <h1 className="text-2xl font-bold">
          Transaksi Saya
        </h1>
      </div>

      {/* List Transaksi */}
      <div className="p-4 space-y-4">
        {orders.map((order) => {
          const Icon = order.icon;

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">
                  <HiOutlineShoppingBag className="text-3xl text-green-600" />

                  <div>
                    <h2 className="font-semibold">
                      {order.product}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {order.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Icon className="text-green-600 text-xl" />

                  <span className="text-sm font-medium">
                    {order.status}
                  </span>
                </div>

              </div>

              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Lihat Detail
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
