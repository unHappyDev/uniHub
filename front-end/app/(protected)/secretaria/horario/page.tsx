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

  const filtered = semesters.filter(s =>
    s.toLowerCase().includes(filterSemester.toLowerCase())
  );

  return (
    <div className="p-8 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-orange-300 uppercase mb-6">
        Turmas
      </h1>

      <input
        className="w-full max-w-3xl mb-6 px-4 py-2 rounded-xl bg-[#1a1a1dc3] border border-orange-400/20"
        placeholder="Filtrar por semestre..."
        value={filterSemester}
        onChange={(e) => setFilterSemester(e.target.value)}
      />

      <ul className="flex flex-col gap-4 w-full max-w-3xl">
        {filtered.map((semester) => (
          <li key={semester}
            className="bg-[#121212b0] border border-orange-400/20 p-4 rounded-xl flex justify-between"
          >
            <span className="font-semibold text-orange-500">
              Semestre {semester}
            </span>

            <Link
              href={`/secretaria/horario/classroom/${semester}`}
              className="text-blue-400 hover:text-blue-500"
            >
              Ver Horário
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
