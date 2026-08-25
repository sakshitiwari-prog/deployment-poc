"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function ChatSidebar() {
  const router = useRouter();
  const onAddNewConvo = async () => {
    const userInput = prompt("Enter conversation name");
    if (userInput !== null) {
      console.log(userInput, "userInput");
      const res = await axios.post("http://localhost:5000/convo/add", {
        name: userInput,
      });
      router.push(`${res?.data?.data?._id}`);
    } else {
      console.log("not entered any input");
    }
  };
  const [conversationList, setConversationList] = useState([]);
  const fetchConvoList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/convo");

      console.log(res, "resres");

      setConversationList(res?.data?.data);
    } catch (e) {}
  };
  useEffect(() => {
    fetchConvoList();
  }, []);

  return (
    <div className="flex w-[300px] p-2 bg-gray-700 flex-col justify-between h-full">
      <button
        type="button"
        onClick={() => {
          onAddNewConvo();
        }}
        className="rounded-lg border p-2 cursor-pointer bg-amber-400 text-black"
      >
        + New chat{" "}
      </button>
      <div className="flex  flex-col gap-1">
        {conversationList?.map((item: any, i: number) => {
          return (
            <div
              key={i}
              className="bg-gray-200 p-2 rounded-lg cursor-pointer"
              onClick={() => {
                router.push(`${item?._id}`);
              }}
            >
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatSidebar;
