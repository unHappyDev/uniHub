"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { getClassroomById } from "@/lib/api/classroom";
import { getStudents } from "@/lib/api/student";
import { createAttendance } from "@/lib/api/attendance";

import { Classroom } from "@/types/Classroom";
import { Student } from "@/types/Student";
import { Schedule } from "@/types/Schedule";

export default function ClassroomAttendancePage() {
  const { id } = useParams();
  const classroomId = id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const [scheduleId, setScheduleId] = useState<string>("");

  const [presence, setPresence] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const room = await getClassroomById(classroomId);
        if (!room) {
          toast.error("Turma não encontrada");
          setLoading(false);
          return;
        }

        setClassroom(room);

        const mappedSchedules: Schedule[] =
          room.schedules?.map((sch: any) => ({
            scheduleId: sch.scheduleId,
            dayOfWeek: sch.dayOfWeek,
            startAt: sch.startAt,
            endAt: sch.endAt,
          })) ?? [];

        setSchedules(mappedSchedules);

        const allStudents = await getStudents();
        const studs = allStudents.filter((s: any) =>
          room.students.some((st) => st.id === s.id),
        );
        setStudents(studs);

        const preset: Record<string, boolean> = {};
        studs.forEach((s: Student) => {
          if (s.id) preset[s.id] = true;
        });
        setPresence(preset);

        setLoading(false);
      } catch (err) {
        toast.error("Erro ao carregar dados");
        setLoading(false);
      }
    }

    if (classroomId) load();
  }, [classroomId]);

  const toggle = (studentId: string) => {
    setPresence(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSave = async () => {
    if (!scheduleId) return toast.error("Selecione um horário");

    try {
      const isoDate = new Date(attendanceDate).toISOString();

      const payloads = students.map((s) => ({
        studentId: s.id!,
        classroomId,
        scheduleId,
        attendanceDate: isoDate,
        presence: presence[s.id!] ?? false,
      }));

      await Promise.all(payloads.map((p) => createAttendance(p)));

      toast.success("Chamada registrada!");
    } catch (err) {
      toast.error("Erro ao salvar chamada");
    }
  };

  if (loading) return <p className="text-white p-6">Carregando...</p>;

  return (
    <div className="p-8 text-white flex flex-col min-h-screen gap-8">

      <h1 className="text-3xl font-bold text-center uppercase">
        Chamada — {classroom?.subject}
      </h1>

      {/* Card de filtros */}
      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow backdrop-blur-md space-y-6">

        {/* Data */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Data</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={e => setAttendanceDate(e.target.value)}
            className="w-full bg-[#1a1a1d] border border-orange-400/20 text-white px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Horário</label>
          <select
            value={scheduleId}
            onChange={e => setScheduleId(e.target.value)}
            className="w-full bg-[#1a1a1d] border border-orange-400/20 text-white px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">Selecione</option>
            {schedules.map((s) => (
              <option key={s.scheduleId} value={s.scheduleId}>
                {s.dayOfWeek} — {s.startAt} às {s.endAt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
        <h2 className="text-xl font-semibold mb-4 text-orange-400">
          Alunos
        </h2>

        <ul className="space-y-3">
          {students.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between bg-[#1a1a1d] border border-orange-400/20 rounded-xl p-3 hover:border-orange-400/40 transition"
            >
              <span className="text-white">
                {(s as any).nome ?? (s as any).username ?? s.id}
              </span>

              <input
                type="checkbox"
                checked={!!presence[s.id!]}
                onChange={() => toggle(s.id!)}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSave}
        className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 text-lg font-semibold rounded-xl shadow-lg mx-auto"
      >
        Salvar Chamada
      </button>

    </div>
  );
}
