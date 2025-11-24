"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClassroomsByProfessor } from "@/lib/api/classroom";
import { Classroom } from "@/types/Classroom";
import { toast } from "sonner";

export default function MinhasTurmasPage() {
  const [semesters, setSemesters] = useState<string[]>([]);
  const [filterSemester, setFilterSemester] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getClassroomsByProfessor();

        const uniqueSemesters = Array.from(
          new Set(data.map((c: Classroom) => c.semester))
        );

        setSemesters(uniqueSemesters);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar turmas");
      }
    }
    load();
  }, []);

  const filtered = semesters.filter((s) =>
    s.toLowerCase().includes(filterSemester.toLowerCase())
  );

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center mb-10">
          Horários das Turmas
        </h1>

        {/* Filtros */}
        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <input
            className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            placeholder="Filtrar por semestre..."
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow transition hover:shadow-orange-500/30">
          <table className="min-w-full rounded-xl text-white">
            <thead>
              <tr className="text-orange-400 uppercase text-sm">
                <th className="px-4 py-3 text-left">Semestre</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center py-6 text-gray-400 bg-neutral-900"
                  >
                    Nenhum semestre encontrado
                  </td>
                </tr>
              ) : (
                filtered.map((semester) => (
                  <tr
                    key={semester}
                    className="border-t border-orange-500/30 transition"
                  >
                    <td className="px-4 py-3">{semester}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/secretaria/horario/classroom/${semester}`}
                        className="text-blue-400 hover:text-blue-500 transition cursor-pointer"
                      >
                        Ver Horário
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-6 mt-6">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
              Nenhum semestre encontrado
            </div>
          ) : (
            filtered.map((semester) => (
              <div
                key={semester}
                className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
              >
                <p>
                  <span className="font-semibold text-orange-500">Semestre:</span>{" "}
                  {semester}
                </p>

                <div className="flex justify-end mt-3">
                  <Link
                    href={`/secretaria/horario/classroom/${semester}`}
                    className="text-blue-400 hover:text-blue-500 transition cursor-pointer"
                  >
                    Ver Horário
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
