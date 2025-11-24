"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClassroomsByProfessor } from "@/lib/api/classroom";
import HorarioTable from "@/components/cadastro/HorarioTable";
import { toast } from "sonner";

export interface HorarioDTO {
  scheduleId: string;
  classroomId: string;
  subjectName: string;
  professorName: string;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

export default function HorarioPorPage() {
  const router = useRouter();
  const { id } = useParams(); // semestre
  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroPeriodo, setFiltroPeriodo] = useState< "manhã" | "noite">("manhã");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const allClassrooms = await getClassroomsByProfessor();
        const semester = String(id);

        const classroomsOfSemester = allClassrooms.filter(
          (c) => c.semester.toLowerCase() === semester.toLowerCase(),
        );

        const result: HorarioDTO[] = [];
        for (const c of classroomsOfSemester) {
          for (const s of c.schedules) {
            result.push({
              scheduleId: s.scheduleId ?? "",
              classroomId: c.classroomId,
              subjectName: c.subject,
              professorName: c.professor,
              dayOfWeek: s.dayOfWeek,
              startAt: s.startAt,
              endAt: s.endAt,
            });
          }
        }

        setHorarios(result);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar horários");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  const horariosFiltrados = horarios.filter((h) => {
    if (filtroPeriodo === "manhã") return h.startAt < "12:00";
    if (filtroPeriodo === "noite") return h.startAt >= "18:00";
    return true;
  });

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">

      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white font-semibold w-max transition-colors cursor-pointer"
        >
          Voltar
        </button>

        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center flex-1 ml-6">
          Horários do Semestre: {id}
        </h1>
      </div>

      <div className="flex gap-3 mb-6">
        {["manhã", "noite"].map((p) => (
          <button
            key={p}
            onClick={() => setFiltroPeriodo(p as any)}
            className={`px-4 py-2 cursor-pointer rounded ${
              filtroPeriodo === p ? "bg-orange-400 text-white" : "bg-gray-200 text-black"
            } transition-colors`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow transition-all hover:shadow-orange-500/30">
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : horariosFiltrados.length === 0 ? (
          <p className="text-gray-400">Nenhum horário encontrado para esse período.</p>
        ) : (
          <HorarioTable horarios={horariosFiltrados} filtroPeriodo={filtroPeriodo} />
        )}
      </div>
    </div>
  );
}
