import React from "react";

function MessageBubble({ children, item }: { children: any; item: any }) {
  return (
    <div
      className={`rounded-lg  border flex w-[300px] flex-col  gap-2 border-gray-300 text-black bg-gray-100 px-3 py-2 ${
        item.role == "user" ? "self-end" : "self-start"
      }`}
    >
      {children}
    </div>
  );
}

export default MessageBubble;
