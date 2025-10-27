"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useContext(AuthContext)!;

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
     className="w-30 h-10 bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 transition-all rounded-x text-white font-medium uppercase cursor-pointer"

    >
      Logout
    </button>
  );
}
