"use client";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { api } from "../utils";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const router = useRouter();
  const user = localStorage.getItem("user");
  const modifiedUser = JSON.parse(user ?? "");
  async function getUserInfo() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userInfo: any = await api.get("/user-info");

    console.log(userInfo, "modifiedList");
  }
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      <p>{modifiedUser?.email}</p>
    </>
  );
}
