"use client";

import LogoutButton from "@/components/auth/LogoutButton";

export default function Navbar() {


  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1>Aluno</h1>
      <LogoutButton />
    </nav>
  );
}
