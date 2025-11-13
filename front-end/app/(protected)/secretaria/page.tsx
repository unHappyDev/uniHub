"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  GraduationCap,
  Users,
  FileText,
  Bell,
  BookOpen,
  ClipboardList,
  Clock,
} from "lucide-react";
import { getPosts } from "@/lib/api/post";
import { Post } from "@/types/Post";
import { toast } from "sonner";

export default function Body() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const MAX_AVISOS = 4; 

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        const sorted = data
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, MAX_AVISOS);
        setPosts(sorted);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
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

  return (
    <div className="p-4 bg-gray-800 text-white min-h-screen">
      <div className="flex flex-col gap-8 p-2 sm:p-4">
        <div className="block md:hidden order-1 bg-gray-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h2 className="text-lg sm:text-xl font-semibold">Avisos Ativos</h2>
          </div>

          {loading ? (
            <p className="text-gray-300 text-sm sm:text-base">Carregando avisos...</p>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 space-y-4">
              <p>Nenhum aviso ativo no momento</p>
              <Link href="/secretaria/avisos">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                  Cadastrar
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {posts.map((post) => (
                  <Link key={post.postId} href="/secretaria/avisos">
                    <div className="p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-md hover:border-yellow-400 transition-all">
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
                        {post.body}
                      </p>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
                        <span>Por: {post.owner}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {posts.length === MAX_AVISOS && (
                <div className="text-center mt-4">
                  <Link href="/secretaria/avisos">
                    <Button className="bg-gradient-to-r from-yellow-400/20 to-orange-500/40 hover:from-yellow-400/30 hover:to-orange-500/50 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all text-xs sm:text-sm">
                      Ver todos os avisos
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Grid superior */}
        <div className="order-2 md:order-1 grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/secretaria/alunos",
              icon: <UserPlus className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-blue-400" />,
              title: "Alunos",
              desc: "Gerenciamento de alunos",
            },
            {
              href: "/secretaria/professores",
              icon: <UserPlus className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-green-400" />,
              title: "Professores",
              desc: "Gerenciamento de professores",
            },
            {
              href: "/secretaria/cursos",
              icon: <GraduationCap className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-yellow-400" />,
              title: "Cursos",
              desc: "Gerenciamento de cursos",
            },
            {
              href: "/secretaria/turmas",
              icon: <Users className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />,
              title: "Turmas",
              desc: "Gerenciamento de turmas",
            },
          ].map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Card className="bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer text-white rounded-xl shadow-md sm:shadow-lg p-2 sm:p-0">
                <CardHeader className="flex flex-col items-center p-2 sm:p-4">
                  {item.icon}
                  <CardTitle className="text-sm sm:text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-xs sm:text-base text-gray-300">
                  {item.desc}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Seção inferior */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 order-2">
          {/* 🔸 Avisos (desktop) */}
          <div className="md:col-span-2 bg-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-semibold">Avisos Ativos</h2>
            </div>

            {loading ? (
              <p className="text-gray-300 text-sm sm:text-base">Carregando avisos...</p>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 space-y-4">
                <p>Nenhum aviso ativo no momento</p>
                <Link href="/secretaria/avisos">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4">
                  {posts.map((post) => (
                    <Link key={post.postId} href="/secretaria/avisos">
                      <div className="p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-md hover:border-yellow-400 transition-all">
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
                          {post.body}
                        </p>
                        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
                          <span>Por: {post.owner}</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {posts.length === MAX_AVISOS && (
                  <div className="text-center mt-4">
                    <Link href="/secretaria/avisos">
                      <Button className="bg-gradient-to-r from-yellow-400/20 to-orange-500/40 hover:from-yellow-400/30 hover:to-orange-500/50 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all text-xs sm:text-sm">
                        Ver todos os avisos
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {[
              {
                href: "/materias",
                icon: <BookOpen className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-blue-400" />,
                title: "Matérias",
                desc: "Gerenciamento de matérias",
              },
              {
                href: "/notas",
                icon: <FileText className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />,
                title: "Notas",
                desc: "Gerenciamento de notas",
              },
              {
                href: "/presencas",
                icon: <ClipboardList className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-green-400" />,
                title: "Presenças",
                desc: "Gerenciamento de presenças",
              },
              {
                href: "/horarios",
                icon: <Clock className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-yellow-400" />,
                title: "Horários",
                desc: "Gerenciamento de horários",
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Card className="bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer text-white rounded-xl shadow-md sm:shadow-lg p-2 sm:p-0">
                  <CardHeader className="flex flex-col items-center p-2 sm:p-4">
                    {item.icon}
                    <CardTitle className="text-sm sm:text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-xs sm:text-base text-gray-300">
                    {item.desc}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden order-2 flex flex-col gap-3 sm:gap-4">
          {[
            {
              href: "/materias",
              icon: <BookOpen className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-blue-400" />,
              title: "Matérias",
              desc: "Gerenciamento de matérias",
            },
            {
              href: "/notas",
              icon: <FileText className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />,
              title: "Notas",
              desc: "Gerenciamento de notas",
            },
            {
              href: "/presencas",
              icon: <ClipboardList className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-green-400" />,
              title: "Presenças",
              desc: "Gerenciamento de presenças",
            },
            {
              href: "/horarios",
              icon: <Clock className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-yellow-400" />,
              title: "Horários",
              desc: "Gerenciamento de horários",
            },
          ].map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Card className="bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer text-white rounded-xl shadow-md sm:shadow-lg p-2 sm:p-0">
                <CardHeader className="flex flex-col items-center p-2 sm:p-4">
                  {item.icon}
                  <CardTitle className="text-sm sm:text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-xs sm:text-base text-gray-300">
                  {item.desc}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
