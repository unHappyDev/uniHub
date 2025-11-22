"use client";

import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/login")}
      className="absolute top-2 right-3 text-white text-xl hover:text-red-400 cursor-pointer"
    >
     &times;
    </button>

  );
}
