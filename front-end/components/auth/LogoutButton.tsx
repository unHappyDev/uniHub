"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Limpa o localStorage (ou cookies, se estiver usando)
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redireciona para a página de login
    router.push("/login");
  };

  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  );
}
