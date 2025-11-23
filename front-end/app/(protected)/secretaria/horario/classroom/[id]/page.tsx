"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  const { id } = useParams(); // semestre
  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const allClassrooms = await getClassroomsByProfessor();
        const semester = String(id);

        const classroomsOfSemester = allClassrooms.filter(
          (c) => c.semester.toLowerCase() === semester.toLowerCase()
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
      }

      setLoading(false);
    }

    if (id) load();
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-orange-300 mb-6">
        Horários do Semestre: {id}
      </h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : horarios.length === 0 ? (
        <p className="text-gray-400">Nenhum horário cadastrado.</p>
      ) : (
        <HorarioTable horarios={horarios} />
      )}
    </div>
  );
}
