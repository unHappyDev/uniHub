"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  Bell,
} from "lucide-react";
import { getPosts } from "@/lib/api/post";
import { Post } from "@/types/Post";
import { toast } from "sonner";
import apiSpring from "@/lib/api/clientSpring";

export default function Body() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    countStudents: 0,
    countProfessors: 0,
    countCourses: 0,
  });

  const MAX_AVISOS = 4;

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await apiSpring.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      }
    }
    fetchDashboard();
  }, []);

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
        if (err.response?.status === 404) setPosts([]);
        else {
          console.error("Erro ao carregar avisos:", err);
          toast.error("Erro ao carregar avisos");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const dashboardCards = [
    {
      href: "/secretaria/cadastro",
      icon: <UserPlus />,
      title: "Alunos",
      desc: `${dashboard.countStudents} Alunos`,
      iconColor: "text-blue-400",
    },
    {
      href: "/secretaria/cadastro",
      icon: <UserPlus />,
      title: "Professores",
      desc: `${dashboard.countProfessors} Professores`,
      iconColor: "text-green-400",
    },
    {
      href: "/secretaria/cursos",
      icon: <GraduationCap />,
      title: "Cursos",
      desc: `${dashboard.countCourses} Cursos`,
      iconColor: "text-yellow-400",
    },
  ];

  const quickAccessCards = [
    {
      href: "/secretaria/turmas",
      icon: <Users />,
      title: "Turmas",
      iconColor: "text-purple-400",
    },
    {
      href: "/secretaria/materias",
      icon: <BookOpen />,
      title: "Matérias",
      iconColor: "text-blue-400",
    },
    {
      href: "/secretaria/horarios",
      icon: <Clock />,
      title: "Horários",
      iconColor: "text-yellow-400",
    },
  ];

  return (
    <div className="p-4 bg-[#141414] text-white min-h-screen">
      <div className="flex flex-col gap-8 p-2 sm:p-4">
        {/* Desktop */}
        <div className="hidden md:grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/60 transition-all shadow-glow cursor-pointer text-white rounded-2xl p-4 sm:p-6 w-full hover:shadow-xl duration-300">
                <CardHeader className="flex flex-col gap-2 p-2 sm:p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base sm:text-xl font-semibold text-gray-200 ml-4">
                      {item.desc}
                    </span>
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 border-orange-400/40 bg-black/20 p-3 ${item.iconColor}`}
                    >
                      {React.cloneElement(item.icon, {
                        className: `w-10 h-10 sm:w-12 sm:h-12 ${item.iconColor}`,
                      })}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-4 sm:p-6 shadow-glow">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-semibold">
                Avisos Ativos
              </h2>
            </div>

            {loading ? (
              <p className="text-gray-300 text-sm sm:text-base">
                Carregando avisos...
              </p>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 space-y-4">
                <p>Nenhum aviso ativo no momento</p>
                <Link href="/secretaria/avisos">
                  <Button className="bg-orange-500/70 hover:bg-orange-600/70 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {posts.map((post) => (
                  <Link key={post.postId} href="/secretaria/avisos">
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
                          {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {posts.length === MAX_AVISOS && (
                  <div className="text-center mt-4">
                    <Link href="/secretaria/avisos">
                      <Button className="bg-orange-500/70 hover:bg-orange-600/70 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                        Ver todos os avisos
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {quickAccessCards.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/60 transition-all shadow-glow cursor-pointer text-white rounded-2xl p-4 flex items-center gap-4">
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full border-2 border-orange-400/40 bg-black/20 p-3 ${item.iconColor}`}
                  >
                    {React.cloneElement(item.icon, {
                      className: `w-10 h-10 ${item.iconColor}`,
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-4">

          <div className="grid grid-cols-3 gap-3">
            {dashboardCards.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div className="bg-orange-500/80 border border-orange-400/20 p-3 rounded-xl flex flex-col items-center justify-center hover:bg-orange-400 transition-all w-full h-30">
                  {React.cloneElement(item.icon, {
                    className: "w-7 h-7 text-white mb-1",
                  })}
                  <span className="text-xs text-white text-center">
                    {`${item.desc} cadastrados`}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quickAccessCards.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div className="bg-[#1a1a1dc3] border border-orange-400/20 p-3 rounded-xl flex flex-col items-center justify-center hover:border-orange-400/50 transition-all w-full h-24">
                  {React.cloneElement(item.icon, {
                    className: "w-7 h-7 text-orange-400 mb-2",
                  })}
                  <span className="text-xs text-white text-center">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-6 shadow-glow min-h-[300px]">
            <div className="flex items-center gap-4 mb-4">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold">Avisos Ativos</h2>
            </div>

            {loading ? (
              <p className="text-gray-300 text-sm">Carregando avisos...</p>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 space-y-6">
                <p>Nenhum aviso ativo no momento</p>
                <Link href="/secretaria/avisos">
                  <Button className="w-full bg-orange-500/70 hover:bg-orange-600/70 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase text-xs sm:text-base">
                    Cadastrar Aviso
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link key={post.postId} href="/secretaria/avisos">
                    <div className="p-4 bg-[#1a1a1d] border border-orange-400/20 rounded-lg shadow-md hover:border-orange-400/40 transition-all">
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-gray-300 mt-1 text-sm">{post.body}</p>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Por: {post.owner}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {posts.length === MAX_AVISOS && (
                  <div className="text-center mt-4">
                    <Link href="/secretaria/avisos">
                      <Button className="w-full bg-orange-500/70 hover:bg-orange-600/70 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase text-xs sm:text-base">
                        Ver todos os avisos
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
