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

  return (
    <div className="p-4 bg-[#141414] text-white min-h-screen">
      <div className="flex flex-col gap-8 p-2 sm:p-4">
        <div className="block md:hidden order-1 bg-glass border border-orange-400/40 rounded-xl p-4 sm:p-6 shadow-glow">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h2 className="text-lg sm:text-xl font-semibold">Avisos Ativos</h2>
          </div>

          {loading ? (
            <p className="text-gray-300 text-sm sm:text-base">
              Carregando avisos...
            </p>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 space-y-4">
              <p>Nenhum aviso ativo no momento</p>
              <Link href="/secretaria/avisos">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                  Cadastrar
                </Button>
              </Link>
            </div>
          ) : (
            <>
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
                          {new Date(post.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
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

        <div className="order-2 md:order-1 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/secretaria/cadastro",
              icon: (
                <UserPlus className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-blue-400" />
              ),
              title: "Alunos",
              desc: ` ${dashboard.countStudents} Alunos cadastrados`,
            },
            {
              href: "/secretaria/cadastro",
              icon: (
                <UserPlus className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-green-400" />
              ),
              title: "Professores",
              desc: ` ${dashboard.countProfessors} Professores cadastrados`,
            },
            {
              href: "/secretaria/cursos",
              icon: (
                <GraduationCap className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-yellow-400" />
              ),
              title: "Cursos",
              desc: ` ${dashboard.countCourses} Cursos cadastrados`,
            },
          ].map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/60 transition-all shadow-glow cursor-pointer text-white rounded-2xl p-4 sm:p-6 w-full hover:shadow-xl duration-300">
                <CardHeader className="flex flex-col gap-2 p-8 sm:p-6">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base sm:text-xl font-semibold text-gray-200 animate-slide-in-left ml-4">
                      {item.desc}
                    </span>

                    <div className="w-25 h-25 flex items-center justify-center rounded-full border-2 border-orange-400/40 bg-black/20 shadow-md p-3">
                      {item.icon}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 order-2">
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
                  <Button className="bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all uppercase cursor-pointer text-xs sm:text-base">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            ) : (
              <>
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
                            {new Date(post.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )}
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
                href: "/secretaria/turmas",
                icon: (
                  <Users className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />
                ),
                title: "Turmas",
                desc: "Gerenciamento de turmas",
              },
              {
                href: "/secretaria/materias",
                icon: (
                  <BookOpen className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-blue-400" />
                ),
                title: "Matérias",
                desc: "Gerenciamento de matérias",
              },
              // {
              //   href: "/secretaria/notas",
              //   icon: (
              //     <FileText className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />
              //   ),
              //   title: "Notas",
              //   desc: "Gerenciamento de notas",
              // },
              // {
              //   href: "/secretaria/presencas",
              //   icon: (
              //     <ClipboardList className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-green-400" />
              //   ),
              //   title: "Presenças",
              //   desc: "Gerenciamento de presenças",
              // },
              {
                href: "/secretaria/horarios",
                icon: (
                  <Clock className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-yellow-400" />
                ),
                title: "Horários",
                desc: "Gerenciamento de horários",
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/60 transition-all shadow-glow cursor-pointer text-white rounded-2xl p-2 sm:p-0 hover:shadow-xl duration-300">
                  <CardHeader className="flex flex-col gap-2 p-2 sm:p-4">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-sm sm:text-lg font-semibold text-gray-200">
                        {item.desc}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:hidden order-2 flex flex-col gap-3 sm:gap-4">
          {[
            {
              href: "/secretaria/turmas",
              icon: (
                <Users className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />
              ),
              title: "Turmas",
              desc: "Gerenciamento de turmas",
            },
            {
              href: "/materias",
              icon: (
                <BookOpen className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-blue-400" />
              ),
              title: "Matérias",
              desc: "Gerenciamento de matérias",
            },
            // {
            //   href: "/notas",
            //   icon: (
            //     <FileText className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-purple-400" />
            //   ),
            //   title: "Notas",
            //   desc: "Gerenciamento de notas",
            // },
            // {
            //   href: "/presencas",
            //   icon: (
            //     <ClipboardList className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-green-400" />
            //   ),
            //   title: "Presenças",
            //   desc: "Gerenciamento de presenças",
            // },
            {
              href: "/horarios",
              icon: (
                <Clock className="w-6 h-6 sm:w-10 sm:h-10 mb-2 text-yellow-400" />
              ),
              title: "Horários",
              desc: "Gerenciamento de horários",
            },
          ].map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/40 transition-all shadow-glow cursor-pointer text-white rounded-xl p-2 sm:p-0">
                <CardHeader className="flex flex-col items-center p-2 sm:p-4">
                  {item.icon}
                  <CardTitle className="text-sm sm:text-lg">
                    {item.title}
                  </CardTitle>
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
