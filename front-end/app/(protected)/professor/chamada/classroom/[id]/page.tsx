"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { getClassroomById } from "@/lib/api/classroom";
import { getStudents } from "@/lib/api/student";
import {
  getAttendancesByClassroom,
  createAttendance,
  updateAttendance,
  getStudentsAbsences,
} from "@/lib/api/attendance";

import { Classroom } from "@/types/Classroom";
import { Student } from "@/types/Student";
import { Schedule } from "@/types/Schedule";
import AttendanceTable from "@/components/cadastro/AttendanceTable";

interface EnrolledStudent extends Student {
  id: string;
  nome: string;
  totalAbsences?: number;
}

const getDayName = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  const days = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];
  return days[date.getDay()];
};

export default function ClassroomAttendancePage() {
  const { id } = useParams();
  const classroomId = id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [scheduleId, setScheduleId] = useState<string>("");
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"create" | "edit" | null>(null);

  const [hasAttendance, setHasAttendance] = useState<boolean>(true);
  const [isLoadingPresence, setIsLoadingPresence] = useState(false);
  const [isValidDay, setIsValidDay] = useState(true);

  const toggle = (studentId: string) => {
    setPresence((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const filteredSchedules = useMemo(() => {
    if (!schedules || !attendanceDate) return [];

    const selectedDayName = getDayName(attendanceDate);

    const validSchedules = schedules.filter(
      (sch) => sch.dayOfWeek.toLowerCase() === selectedDayName
    );

    setIsValidDay(validSchedules.length > 0);
    return validSchedules;
  }, [attendanceDate, schedules]);

  const loadClassroomData = useCallback(async () => {
    try {
      const room = await getClassroomById(classroomId);
      if (!room) {
        toast.error("Turma não encontrada");
        setLoading(false);
        return;
      }
      setClassroom(room);

      const mappedSchedules: Schedule[] =
        room.schedules?.map((sch: any): Schedule => ({
          scheduleId: sch.scheduleId,
          dayOfWeek: sch.dayOfWeek,
          startAt: sch.startAt,
          endAt: sch.endAt,
        })) ?? [];
      setSchedules(mappedSchedules);

      const absencesData = await getStudentsAbsences();

      const absencesMap = absencesData.reduce(
        (acc, current) => {
          if (current.classroomId === classroomId) {
            acc[current.studentId] = current.numAbsences;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const allStudents = await getStudents();

      const studs = allStudents
        .filter((s: Student) =>
          room.students.some((st: any) => st.id === s.id)
        )
        .map((s: Student) => ({
          ...s,
          id: s.id!,
          nome: s.nome || (s as any).username || "Aluno sem nome",
          totalAbsences: absencesMap[s.id!] ?? 0,
        })) as EnrolledStudent[];

      setStudents(studs);

      const preset: Record<string, boolean> = {};
      studs.forEach((s) => (preset[s.id] = true));
      if (mode !== "edit") {
        setPresence(preset);
      }

      const initialDayName = getDayName(attendanceDate);
      const initialValid = mappedSchedules.some(
        (sch) => sch.dayOfWeek.toLowerCase() === initialDayName
      );
      setIsValidDay(initialValid);

      if (!initialValid) setScheduleId("");

      setLoading(false);
    } catch (error) {
      toast.error("Erro ao carregar dados");
      setLoading(false);
    }
  }, [classroomId, mode, attendanceDate]);

  useEffect(() => {
    if (classroomId) loadClassroomData();
  }, [classroomId, loadClassroomData]);

  useEffect(() => {
    if (mode) {
      const today = new Date().toISOString().split("T")[0];
      setAttendanceDate(today);
      setScheduleId("");
      setPresence({});
      setIsLoadingPresence(false);
      setHasAttendance(true);
    }
  }, [mode]);

  useEffect(() => {
    if (!isValidDay) {
      setIsLoadingPresence(false);
      setScheduleId("");
      return;
    }

    async function loadPresence() {
      if (!mode || !scheduleId || students.length === 0) {
        setHasAttendance(true);
        return;
      }

      setHasAttendance(true);

      try {
        const preset: Record<string, boolean> = {};

        if (mode === "create") {
          const allAttendances = await getAttendancesByClassroom(classroomId);

          const filtered = allAttendances.filter(
            (a) =>
              a.schedule?.scheduleId === scheduleId &&
              a.attendanceDate.slice(0, 10) === attendanceDate
          );

          if (filtered.length > 0) {
            toast.error("Já existe uma chamada registrada para este dia e horário.");
            setMode(null);
            setIsLoadingPresence(false);
            return;
          }
        }

        if (mode === "edit") {
          const allAttendances = await getAttendancesByClassroom(classroomId);

          const filtered = allAttendances.filter(
            (a) =>
              a.schedule?.scheduleId === scheduleId &&
              a.attendanceDate.slice(0, 10) === attendanceDate
          );

          if (filtered.length === 0) {
            setHasAttendance(false);
            setPresence({});
            setIsLoadingPresence(false);
            return;
          }

          students.forEach((s) => {
            const att = filtered.find((f) => f.studentId === s.id);
            preset[s.id] = att ? att.presence : false;
          });
        } else {
          students.forEach((s) => {
            preset[s.id] = true;
          });
          setHasAttendance(true);
        }

        setPresence(preset);
        setIsLoadingPresence(false);
      } catch {
        setIsLoadingPresence(false);
      }
    }

    loadPresence();
  }, [
    mode,
    scheduleId,
    attendanceDate,
    students,
    classroomId,
    isValidDay,
  ]);

  const handleSave = async () => {
    if (!scheduleId) return toast.error("Selecione um horário");
    if (!isValidDay) return toast.error("A data selecionada não é um dia de aula.");

    try {
      const isoDate = new Date(attendanceDate).toISOString();
      const existingAttendances = await getAttendancesByClassroom(classroomId);

      const filtered = existingAttendances.filter(
        (a) =>
          a.schedule?.scheduleId === scheduleId &&
          a.attendanceDate.slice(0, 10) === attendanceDate
      );

      await Promise.all(
        students.map(async (s) => {
          const att = filtered.find((f) => f.studentId === s.id);
          if (att) {
            await updateAttendance(att.id!, { presence: presence[s.id] });
          } else {
            await createAttendance({
              studentId: s.id,
              classroomId,
              scheduleId,
              attendanceDate: isoDate,
              presence: presence[s.id] ?? false,
            });
          }
        })
      );

      toast.success("Chamada registrada!");

      await loadClassroomData();

      setMode(null);
    } catch {
      toast.error("Erro ao salvar chamada");
    }
  };

  if (loading) return <p className="text-white p-6">Carregando...</p>;

  return (
    <div className="p-8 text-white flex flex-col min-h-screen gap-8">
      <h1 className="text-3xl font-bold text-center uppercase">
        Chamada — {classroom?.subject}
      </h1>

      {!mode && (
        <>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                setAttendanceDate(today);
                setScheduleId("");
                setPresence({});
                setIsLoadingPresence(false);
                setHasAttendance(true);
                setMode("create");
              }}
              className="bg-green-500 hover:bg-green-600 transition px-6 py-3 text-lg font-semibold rounded-xl"
            >
              Criar Chamada
            </button>
            <button
              onClick={() => setMode("edit")}
              className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 text-lg font-semibold rounded-xl"
            >
              Editar Chamada
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Resumo de Faltas</h2>
            <AttendanceTable students={students} showAbsencesOnly />
          </div>
        </>
      )}

      {mode && (
        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow backdrop-blur-md space-y-6 mt-6">
          <button
            onClick={() => setMode(null)}
            className="bg-gray-600 hover:bg-gray-700 transition px-4 py-2 text-sm rounded-xl"
          >
            Voltar
          </button>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Data</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => {
                const newDate = e.target.value;
                setAttendanceDate(newDate);
                setScheduleId("");
                setIsLoadingPresence(true);
                setHasAttendance(true);
              }}
              className="w-full bg-[#1a1a1d] border border-orange-400/20 text-white px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {!isValidDay && (
            <p className="text-red-400 text-center text-lg font-semibold py-4 border border-red-400/50 rounded-xl bg-red-900/20">
              🚫 A turma {classroom?.subject} não tem aula nesta data (
              {getDayName(attendanceDate).charAt(0).toUpperCase() +
                getDayName(attendanceDate).slice(1)}
              ).
            </p>
          )}

          <div
            className={`${!isValidDay ? "opacity-50 pointer-events-none" : ""}`}
          >
            <label className="block mb-1 text-sm text-gray-300">
              Horário
            </label>

            <select
              value={scheduleId}
              onChange={(e) => {
                const newScheduleId = e.target.value;
                setScheduleId(newScheduleId);

                if (newScheduleId) {
                  setIsLoadingPresence(true);
                  setHasAttendance(true);
                } else {
                  setIsLoadingPresence(false);
                }
              }}
              disabled={!isValidDay}
              className="w-full bg-[#1a1a1d] border border-orange-400/20 text-white px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">Selecione</option>
              {filteredSchedules.map((s: Schedule) => (
                <option key={s.scheduleId} value={s.scheduleId}>
                  {s.dayOfWeek} — {s.startAt} às {s.endAt}
                </option>
              ))}
            </select>

            {isValidDay && filteredSchedules.length === 0 && (
              <p className="text-sm text-gray-400 mt-1">
                Nenhum horário cadastrado para esta turma neste dia.
              </p>
            )}
          </div>

          {scheduleId && isLoadingPresence && isValidDay && (
            <p className="text-white text-center py-4">
              Verificando registros de chamada...
            </p>
          )}

          {scheduleId && !isLoadingPresence && hasAttendance && isValidDay && (
            <>
              <AttendanceTable
                students={students}
                scheduleId={scheduleId}
                presence={presence}
                toggle={toggle}
              />

              <button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 text-lg font-semibold rounded-xl shadow-lg mx-auto mt-4"
              >
                Salvar Chamada
              </button>
            </>
          )}

          {mode === "edit" &&
            scheduleId &&
            !isLoadingPresence &&
            !hasAttendance &&
            isValidDay && (
              <p className="text-yellow-400 text-center text-lg font-semibold py-4 border border-yellow-400/50 rounded-xl bg-yellow-900/20">
                ⚠️ Nenhuma chamada registrada para o dia e horário selecionados.
              </p>
            )}
        </div>
      )}
    </div>
  );
}
