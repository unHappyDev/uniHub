"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, // Para Notas
  CalendarCheck, // Para Presença
  Clock, // Para Horário
  Bell, // Para Avisos
} from "lucide-react";
import { getPosts } from "@/lib/api/post";
import { Post } from "@/types/Post";
import { toast } from "sonner";
// import apiSpring from "@/lib/api/clientSpring"; // Não é mais necessário para este componente, já que as contagens foram removidas

export default function ProfessorBody() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const MAX_AVISOS = 4;

  // 1. Hook para buscar Avisos (mantido)
  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        const sorted = data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, MAX_AVISOS);

        setPosts(sorted);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setPosts([]);
        } else {
          console.error("Erro ao carregar avisos:", err);
          toast.error("Erro ao carregar avisos");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Definição dos cartões de Acesso Rápido do Professor
  const professorQuickAccessCards = [
    {
      href: "/professor/notas",
      icon: (
        <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-purple-400" />
      ),
      title: "Lançamento de Notas",
      desc: "Gerenciar notas por turma",
      iconColor: "text-purple-400"
    },
    {
      href: "/professor/attendance",
      icon: (
        <CalendarCheck className="w-6 h-6 sm:w-10 sm:h-10 text-green-400" />
      ),
      title: "Registro de Presença",
      desc: "Lançar e consultar frequência",
      iconColor: "text-green-400"
    },
    {
      href: "/professor/horario",
      icon: (
        <Clock className="w-6 h-6 sm:w-10 sm:h-10 text-yellow-400" />
      ),
      title: "Meu Horário",
      desc: "Consultar horários de aula",
      iconColor: "text-yellow-400"
    },
    // Adicionando o aviso como um atalho também, mantendo a consistência do grid
    {
      href: "/professor/avisos",
      icon: (
        <Bell className="w-6 h-6 sm:w-10 sm:h-10 text-orange-400" />
      ),
      title: "Avisos Acadêmicos",
      desc: "Ver comunicados da Secretaria",
      iconColor: "text-orange-400"
    },
  ];


  return (
    <div className="p-4 bg-[#141414] text-white min-h-screen">
      <div className="flex flex-col gap-8 p-2 sm:p-4">
        
        {/* 1. Cartões de Atalho do Professor (Grid 4 colunas) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {professorQuickAccessCards.map((item, idx) => (
            <Link key={idx} href={item.href}>
              {/* CORREÇÃO APLICADA: Adicionado 'flex items-center' ao Card */}
              <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/60 transition-all shadow-glow cursor-pointer text-white rounded-2xl p-4 w-full h-full hover:shadow-xl duration-300 flex items-center">
                
                {/* CORREÇÃO APLICADA: Garantido 'flex flex-row items-center' no CardHeader */}
                <CardHeader className="flex flex-row items-center justify-start gap-4 p-0 w-full">
                  
                  {/* Container do Ícone: Garante que o ícone esteja centralizado no círculo */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-black/20 p-2 ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  
                  {/* Bloco de Texto: Centralizado verticalmente pelo CardHeader */}
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* 2. Avisos Ativos (Conteúdo principal) */}
        <div className="grid grid-cols-1">
          <div className="bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-4 sm:p-6 shadow-glow">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-semibold">
                Avisos da Secretaria
              </h2>
            </div>

            {loading ? (
              <p className="text-gray-300 text-sm sm:text-base">
                Carregando avisos...
              </p>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 space-y-4 h-40 flex flex-col justify-center items-center">
                <p>Nenhum aviso ativo no momento</p>
                <Link href="/professor/avisos">
                  <Button className="bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                    Ver Arquivo de Avisos
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4">
                  {posts.map((post) => (
                    <Link key={post.postId} href="/professor/avisos">
                      <div className="p-3 sm:p-4 bg-[#1a1a1d] border border-orange-400/20 rounded-lg shadow-md hover:border-orange-400/40 transition-all">
                        <h3 className="text-base sm:text-lg font-semibold">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
                          {post.body}
                        </p>
                        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
                          <span>Por: {post.owner}</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "pt-BR",
                              { day: "2-digit", month: "2-digit", year: "numeric" },
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {posts.length === MAX_AVISOS && (
                  <div className="text-center mt-4">
                    <Link href="/professor/avisos">
                      <Button className="bg-gradient-to-r from-yellow-400/20 to-orange-500/40 hover:from-yellow-400/30 hover:to-orange-500/50 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all text-xs sm:text-sm">
                        Ver todos os avisos
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}