"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CalendarCheck, Clock, Bell } from "lucide-react";
import { getPosts } from "@/lib/api/post";
import { getClassroomsByLoggedProfessor } from "@/lib/api/classroom";
import { Post } from "@/types/Post";
import { toast } from "sonner";

interface HorarioDTO {
  classroomId: string;
  subjectName: string;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

const MAX_AVISOS = 4;

export default function ProfessorBody() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();

        if (!data || data.length === 0) {
          setPosts([]);
          return;
        }

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
        }
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    async function fetchHorarios() {
      try {
        const turmas = await getClassroomsByLoggedProfessor();
        const mapHorarios: HorarioDTO[] = [];

        turmas.forEach((turma) => {
          turma.schedules.forEach((s) => {
            mapHorarios.push({
              classroomId: turma.classroomId,
              subjectName: turma.subject,
              dayOfWeek: s.dayOfWeek.toUpperCase(),
              startAt: s.startAt,
              endAt: s.endAt,
            });
          });
        });

        setHorarios(mapHorarios);
      } catch (err) {
        toast.error("Erro ao carregar horários");
      } finally {
        setLoadingHorarios(false);
      }
    }

    fetchHorarios();
  }, []);

  const professorQuickAccessCards = [
    {
      href: "/professor/notas",
      icon: <FileText className="w-6 h-6" />,
      title: "Lançamento de Notas",
      desc: "Gerenciar notas por turma",
      iconColor: "text-purple-400",
    },
    {
      href: "/professor/chamada",
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Registro de Presença",
      desc: "Lançar e consultar frequência",
      iconColor: "text-green-400",
    },
    {
      href: "/professor/horario",
      icon: <Clock className="w-6 h-6" />,
      title: "Meu Horário",
      desc: "Consultar horários de aula",
      iconColor: "text-yellow-400",
    },
    {
      href: "/professor/avisos",
      icon: <Bell className="w-6 h-6" />,
      title: "Avisos Acadêmicos",
      desc: "Ver comunicados da Secretaria",
      iconColor: "text-orange-400",
    },
  ];

  const horariosPorDia = horarios.reduce(
    (acc, h) => {
      if (!acc[h.dayOfWeek]) acc[h.dayOfWeek] = [];
      acc[h.dayOfWeek].push(h);
      return acc;
    },
    {} as Record<string, HorarioDTO[]>,
  );

  const diasDaSemana = [
    { key: "SEGUNDA", label: "Segunda" },
    { key: "TERCA", label: "Terça" },
    { key: "QUARTA", label: "Quarta" },
    { key: "QUINTA", label: "Quinta" },
    { key: "SEXTA", label: "Sexta" },
  ];

  return (
    <div className="p-4 bg-[#141414] text-white min-h-screen">
      <div className="flex flex-col gap-8 p-2 sm:p-4">
        <div className="md:hidden grid grid-cols-4 gap-3 mb-4">
          {professorQuickAccessCards.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <div className="bg-[#1a1a1dc3] border border-orange-400/20 p-3 rounded-xl flex flex-col items-center justify-center hover:border-orange-400/50 transition-all w-25 h-25">
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

        <div className="md:hidden bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-4 min-h-[220px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold">Avisos</h2>
            </div>

            {loadingPosts ? (
              <p className="text-gray-300 text-sm">Carregando avisos...</p>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 mt-4 flex flex-col items-center gap-4">
                <p>Nenhum aviso disponível</p>
              </div>
            ) : (
              <>
                {posts.slice(0, 2).map((post) => (
                  <Link key={post.postId} href="/professor/avisos">
                    <div className="p-3 bg-[#1a1a1d] border border-orange-400/20 rounded-lg mb-3">
                      <h3 className="text-base font-semibold">{post.title}</h3>
                      <p className="text-gray-300 text-sm mt-1">{post.body}</p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>

          <div>
            {posts.length === 0 ? (
              <Link href="/professor/avisos">
                <Button className="w-full bg-orange-500/70 hover:bg-orange-600/70 text-white rounded-xl text-xs py-2 cursor-pointer">
                  Cadastrar Aviso
                </Button>
              </Link>
            ) : posts.length > 2 ? (
              <Link href="/professor/avisos">
                <Button className="w-full bg-orange-500/70 hover:bg-orange-600/70 text-white rounded-xl text-xs py-2 cursor-pointer">
                  Ver mais avisos
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="md:hidden bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-4 shadow-glow mt-6">
          <h2 className="text-orange-300 font-semibold text-lg text-center mb-3">
            Horário da Semana
          </h2>

          <div className="overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-4 min-w-max">
              {diasDaSemana.map((dia) => (
                <div
                  key={dia.key}
                  className="bg-[#1a1a1d] border border-orange-400/30 rounded-xl p-4 w-52 flex-shrink-0 shadow-sm 
             hover:border-orange-500/70 transition-all"
                >
                  <p className="text-orange-400 font-semibold text-center mb-3 uppercase tracking-wide">
                    {dia.label}
                  </p>

                  {horariosPorDia[dia.key] &&
                  horariosPorDia[dia.key].length > 0 ? (
                    horariosPorDia[dia.key].map((h, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1a1a1d] p-3 rounded-lg border border-orange-400/20 mb-3 shadow-sm"
                      >
                        <p className="text-gray-200 text-sm font-semibold uppercase text-orange-300">
                          {h.subjectName}
                        </p>

                        <p className="text-gray-400 text-xs mt-1">
                          {h.startAt} - {h.endAt}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center text-xs italic mt-6">
                      Sem aulas
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          {loadingHorarios ? (
            <p className="text-gray-300 mb-6">Carregando horários...</p>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {diasDaSemana.map((dia) => (
                <Card
                  key={dia.key}
                  className="bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-4 shadow-glow 
                 hover:border-orange-500/70 transition-all"
                >
                  <CardHeader className="text-lg font-semibold text-orange-500 uppercase">
                    {dia.label}
                  </CardHeader>
                  <div className="mt-2 space-y-2">
                    {horariosPorDia[dia.key] &&
                    horariosPorDia[dia.key].length > 0 ? (
                      horariosPorDia[dia.key].map((h, idx) => (
                        <div
                          key={idx}
                          className="bg-[#1a1a1d] p-2 rounded-lg border border-orange-400/20 shadow-sm
                         hover:border-orange-500/50 transition-all"
                        >
                          <p className="font-medium text-gray-200 uppercase text-orange-300">
                            {h.subjectName}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {h.startAt} - {h.endAt}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        Sem aula neste dia
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#1a1a1dc3] border border-orange-400/20 rounded-xl p-6 shadow-glow">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-semibold">Avisos</h2>
              </div>

              {loadingPosts ? (
                <p className="text-gray-300">Carregando avisos...</p>
              ) : posts.length === 0 ? (
                <div className="text-center text-gray-400 space-y-4 h-40 flex flex-col justify-center items-center">
                  <p>Nenhum aviso ativo no momento</p>
                  <Link href="/professor/avisos">
                    <Button className="bg-orange-500/70 hover:bg-orange-600/70 text-white px-6 py-3 rounded-xl shadow-md uppercase cursor-pointer">
                      Cadastrar Aviso
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Link key={post.postId} href="/professor/avisos">
                      <div className="p-4 bg-[#1a1a1d] border border-orange-400/20 rounded-lg hover:border-orange-400/40 transition-all">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-gray-300 mt-2">{post.body}</p>
                        <div className="flex justify-between text-sm text-gray-400 mt-3">
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

                  {posts.length === MAX_AVISOS && (
                    <div className="text-center">
                      <Link href="/professor/avisos">
                        <Button className="bg-orange-500/70 hover:bg-orange-600/70 text-white px-6 py-3 rounded-xl uppercase cursor-pointer">
                          Ver todos os avisos
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {professorQuickAccessCards.map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <Card className="bg-[#1a1a1dc3] border border-orange-400/20 hover:border-orange-400/60 shadow-glow cursor-pointer text-white rounded-2xl p-4 flex items-center gap-4">
                    <div
                      className={`w-20 h-20 flex items-center justify-center rounded-full border-2 border-orange-400/40 bg-black/20 p-3 ${item.iconColor}`}
                    >
                      {React.cloneElement(item.icon, {
                        className: `w-12 h-12 ${item.iconColor}`,
                      })}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
