"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useContext(AuthContext)!;

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
     className="w-30 h-10 bg-orange-500  hover:bg-transparent hover:border-2 hover:border-orange-500 px-2 py-1 rounded cursor-pointer transition duration-300 ease-in-out"

    >
      Logout
    </button>
  );
}
