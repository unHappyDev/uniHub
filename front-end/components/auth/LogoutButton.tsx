"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useContext(AuthContext)!;

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
      className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
