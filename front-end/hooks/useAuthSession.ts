"use client"
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  avatar: string;
}

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await axios.get("/api/v1/verify-session");

        setUser({
          name: data.user.username, // 🔁 Corrigido
          email: data.user.email,   // 🔁 Corrigido
          avatar: "/imagens/user.svg", // Ainda é fixo, você pode melhorar depois
        });
      } catch (error) {
        console.error("Erro ao verificar sessão", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  return { user, loading };
}
