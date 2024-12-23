"use client"

import Image from "next/image";
import { useEffect } from "react";
import { getCookieWithKey } from "./utils/cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = getCookieWithKey("token");
    if (token) {
      router.push("/contract");
    } else {
      router.push("/login");
    }
  }, []);
  return (
    <></>
  );
}
