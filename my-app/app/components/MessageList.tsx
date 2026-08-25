import React from "react";
import MessageBubble from "./MessageBubble";

function MessageList({ messageList }: any) {
  return (
    <div className={`flex flex-col gap-2`}>
      {messageList?.map((item: any) => {
        return (
          <MessageBubble item={item} key={item._id}>
            <h4>{item.role}</h4>
            <p>{item.content}</p>
          </MessageBubble>
        );
      })}
    </div>
  );
}

export default MessageList;
