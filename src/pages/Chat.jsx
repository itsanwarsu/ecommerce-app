import {
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const chats = [
  {
    id: 1,
    name: "ASUS Official Store",
    message: "Halo, barang masih tersedia.",
    time: "09:15",
    unread: 2,
  },
  {
    id: 2,
    name: "Nike Indonesia",
    message: "Pesanan Anda sedang diproses.",
    time: "Kemarin",
    unread: 0,
  },
  {
    id: 3,
    name: "Apple Store",
    message: "Terima kasih telah berbelanja.",
    time: "Senin",
    unread: 1,
  },
];

export default function Chat() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 mt-[72px]">

      {/* Header */}
      <div className="bg-green-600 text-white p-5">
        <h1 className="text-2xl font-bold">
          Chat
        </h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-3 text-gray-400 text-xl" />

          <input
            type="text"
            placeholder="Cari chat..."
            className="w-full bg-white border rounded-lg py-2 pl-10 pr-4"
          />
        </div>
      </div>

      {/* List Chat */}
      <div className="space-y-2 px-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="bg-white rounded-xl p-4 shadow flex justify-between items-center cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <HiOutlineUserCircle className="text-5xl text-green-600" />

              <div>
                <h2 className="font-semibold">
                  {chat.name}
                </h2>

                <p className="text-gray-500 text-sm">
                  {chat.message}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">
                {chat.time}
              </p>

              {chat.unread > 0 && (
                <div className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mt-2 ml-auto">
                  {chat.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
