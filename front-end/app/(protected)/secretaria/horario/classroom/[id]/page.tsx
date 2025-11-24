"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClassroomsByProfessor } from "@/lib/api/classroom";
import HorarioTable from "@/components/cadastro/HorarioTable";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [filtroPeriodo, setFiltroPeriodo] = useState<"manhã" | "noite">(
    "manhã",
  );

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
          className="hidden md:block px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white font-semibold w-max transition-colors cursor-pointer"
        >
          Voltar
        </button>

        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center flex-1 ml-6">
          Horários do Semestre: {id}
        </h1>
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-6 shadow-glow transition-all hover:shadow-orange-500/30">
        <label className="block mb-2 text-orange-200 font-semibold uppercase tracking-wide">
          Filtrar por período:
        </label>

        <Select
          value={filtroPeriodo}
          onValueChange={(value) =>
            setFiltroPeriodo(value as "manhã" | "noite")
          }
        >
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/20 py-3 text-white cursor-pointer rounded-xl shadow-inner cursor-pointer focus:ring-2 focus:ring-orange-500/40 transition-all">
            <SelectValue placeholder="Selecione um período" />
          </SelectTrigger>
          <SelectContent className="bg-[#151a1b] text-white">
            <SelectItem value="manhã" className="cursor-pointer">Manhã</SelectItem>
            <SelectItem value="noite" className="cursor-pointer">Noite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow transition-all hover:shadow-orange-500/30">
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : horariosFiltrados.length === 0 ? (
          <p className="text-gray-400">
            Nenhum horário encontrado para esse período.
          </p>
        ) : (
          <HorarioTable
            horarios={horariosFiltrados}
            filtroPeriodo={filtroPeriodo}
          />
        )}
      </div>
    </div>
  );
}
