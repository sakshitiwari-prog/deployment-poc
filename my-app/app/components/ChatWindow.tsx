"use client";
import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import axios from "axios";
import { useParams } from "next/navigation";

function ChatWindow({ conversationId }: any) {
  const [messageList, setmessageList] = useState([]);
  const fetchMsgList = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/convo/${conversationId}`,
      );
      setmessageList(res?.data?.data);
    } catch (e) {}
  };
  async function send(val: any) {
    try {
      // =========================
      // 1. Normal text message
      // =========================
      if (val?.text?.trim()) {
        const res = await axios.post("http://localhost:5000/convo/add/msg", {
          conversationId,
          role: "user",
          content: val.text.trim(),
        });

        console.log(res.data.data, "chat response");

        setmessageList(res.data.data);

        return;
      }

      // =========================
      // 2. PDF upload
      // =========================
      if (val?.file) {
        const formData = new FormData();

        formData.append("conversationId", conversationId);
        formData.append("file", val.file);

        const res = await axios.post(
          "http://localhost:5000/convo/documents/upload",
          formData,
        );

        console.log(res.data, "PDF upload response");

        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    fetchMsgList();
  }, [conversationId]);
  return (
    <div className=" w-full  justify-end bg-blue-200/50  p-4 flex gap-4 flex-col">
      <MessageList messageList={messageList} />
      <MessageInput send={(val: any) => send(val)} />
    </div>
  );
}

export default ChatWindow;
