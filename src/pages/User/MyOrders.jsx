import { useEffect, useMemo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import useOrderStore from "../../store/orderStore";
import useTransactionSearchStore from "../../store/transactionSearchStore";

export default function MyOrders() {
  const {
    orders,
    loading,
    loadOrders,
  } = useOrderStore();

  const searchTransaction = useTransactionSearchStore(
    (state) => state.searchTransaction
  );

  const setSearchTransaction = useTransactionSearchStore(
    (state) => state.setSearchTransaction
  );


  useEffect(() => {
    loadOrders();
  }, [loadOrders]);


  const filteredOrders = useMemo(() => {
    const query = searchTransaction.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {

      const matchName =
        order.customerName
          ?.toLowerCase()
          .includes(query);


      const matchProduct =
        order.items?.some((item) =>
          item.product?.name
            ?.toLowerCase()
            .includes(query)
        );


      return matchName || matchProduct;
    });

  }, [orders, searchTransaction]);


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">
          Memuat pesanan...
        </p>
      </div>
    );
  }


  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
        <HiOutlineShoppingBag className="text-7xl text-gray-400 mb-4" />

        <h1 className="text-3xl font-bold mb-2">
          Pesanan Saya
        </h1>

        <p className="text-gray-500">
          Kamu belum memiliki pesanan.
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 text-black p-5 pt-24">

      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Pesanan Saya
          </h1>


          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchTransaction}
            onChange={(e)=>setSearchTransaction(e.target.value)}
            className="
              border
              rounded-lg
              px-4
              py-2
              w-64
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>



        {filteredOrders.length === 0 ? (

          <p className="text-center text-gray-500 py-10">
            Transaksi tidak ditemukan.
          </p>

        ) : (

          filteredOrders.map((order)=> (

            <div
              key={order._id}
              className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                mb-6
              "
            >


              <div className="flex justify-between border-b pb-4 mb-4">

                <div>

                  <h2 className="font-bold text-lg">
                    Pesanan #{order._id.slice(-6)}
                  </h2>

                  <p className="text-gray-500">
                    {new Date(order.createdAt)
                    .toLocaleDateString("id-ID")}
                  </p>

                </div>


                <span
                  className="
                    bg-yellow-100
                    text-yellow-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                  "
                >
                  {order.status}
                </span>


              </div>




              <div className="mb-5">

                <h3 className="font-semibold mb-2">
                  Penerima
                </h3>


                <p>
                  Nama: {order.customerName}
                </p>


                <p>
                  Alamat: {order.address}
                </p>


              </div>




              <h3 className="font-semibold mb-3">
                Produk
              </h3>



              <div className="space-y-4">

                {order.items.map((item,index)=>{

                  const product = item.product || {};


                  const image =
                    product.image?.url ||
                    product.image ||
                    "https://via.placeholder.com/100";


                  return (

                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        pb-4
                      "
                    >

                      <div className="flex gap-4 items-center">

                        <img
                          src={image}
                          alt={product.name}
                          className="
                            w-20
                            h-20
                            object-cover
                            rounded-lg
                          "
                        />


                        <div>

                          <h4 className="font-semibold">
                            {product.name}
                          </h4>


                          <p className="text-gray-500">
                            Qty: {item.quantity}
                          </p>


                          <p className="text-gray-500">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>


                        </div>

                      </div>



                      <p className="font-bold text-blue-600">
                        Rp {(item.price * item.quantity)
                        .toLocaleString("id-ID")}
                      </p>


                    </div>

                  );

                })}

              </div>




              <div className="flex justify-between mt-6 pt-4 border-t">

                <span className="font-bold text-lg">
                  Total
                </span>


                <span className="font-bold text-2xl text-blue-600">
                  Rp {order.total.toLocaleString("id-ID")}
                </span>


              </div>


            </div>

          ))

        )}

      </div>

    </div>
  );
}
