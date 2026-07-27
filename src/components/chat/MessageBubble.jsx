const MessageBubble = ({ message, currentUser }) => {
  const senderId =
    typeof message.sender === "object"
      ? message.sender?._id
      : message.sender;

  const mine = senderId === currentUser;

  return (
    <div
      className={`flex mb-3 ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
          mine
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-900"
        }`}
      >
        <p className="break-words">{message.text}</p>

        <div
          className={`mt-1 text-xs ${
            mine ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
