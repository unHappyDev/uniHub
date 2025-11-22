"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useContext(AuthContext)!;

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
     className="w-30 h-10 bg-orange-500/70 hover:bg-orange-600/70 transition-all rounded-x text-white font-medium uppercase cursor-pointer"

    >
      Logout
    </button>
  );
}
