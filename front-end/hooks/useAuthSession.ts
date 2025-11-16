"use client"
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  avatar: string;
  role: "ADMIN" | "PROFESSOR" | "USER";
}

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await axios.get("/api/v1/verify-session");

        setUser({
          name: data.user.username,
          email: data.user.email,
          avatar: "/imagens/user.svg",
          role: data.user.role, 
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
