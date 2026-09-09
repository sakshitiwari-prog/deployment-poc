/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { api } from "../utils";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  async function getUserInfo() {
    const userInfo: any = await api.get("/user-info");

    console.log(userInfo, "modifiedList");
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }

    getUserInfo();
  }, []);

  return (
    <>
      <p>{user?.email}</p>
    </>
  );
}