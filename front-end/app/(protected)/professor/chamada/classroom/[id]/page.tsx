"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";

import { getClassroomById } from "@/lib/api/classroom";
import { useParams, useRouter } from "next/navigation";
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
import { DatePicker } from "@/components/layout/Calendario";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

const getLocalDate = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function ClassroomAttendancePage() {
  const { id } = useParams();
  const router = useRouter();
  const classroomId = id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [filterStudent, setFilterStudent] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState<string>(getLocalDate());
  const [scheduleId, setScheduleId] = useState<string>("");
  const [mode, setMode] = useState<"create" | "edit" | null>(null);

  const [presence, setPresence] = useState<
    Record<string, { present: boolean; absent: boolean }>
  >({});
  const [hasAttendance, setHasAttendance] = useState<boolean>(true);
  const [isLoadingPresence, setIsLoadingPresence] = useState(false);
  const [isValidDay, setIsValidDay] = useState(true);

  const togglePresence = (studentId: string, type: "present" | "absent") => {
    setPresence((prev) => {
      const current = prev[studentId] || { present: false, absent: false };
      const updated =
        type === "present"
          ? { present: !current.present, absent: false }
          : { present: false, absent: !current.absent };
      return { ...prev, [studentId]: updated };
    });
  };

  const filteredStudents = useMemo(
    () =>
      students.filter((s) =>
        s.nome.toLowerCase().includes(filterStudent.toLowerCase()),
      ),
    [students, filterStudent],
  );

  const filteredSchedules = useMemo(() => {
    if (!schedules || !attendanceDate) return [];
    const selectedDayName = getDayName(attendanceDate);
    const validSchedules = schedules.filter(
      (sch) => sch.dayOfWeek.toLowerCase() === selectedDayName,
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
        room.schedules?.map((sch: any) => ({
          scheduleId: sch.scheduleId,
          dayOfWeek: sch.dayOfWeek,
          startAt: sch.startAt,
          endAt: sch.endAt,
        })) ?? [];
      setSchedules(mappedSchedules);

      const absencesData = await getStudentsAbsences();
      const absencesMap = absencesData.reduce(
        (acc, cur) => {
          if (cur.classroomId === classroomId)
            acc[cur.studentId] = cur.numAbsences;
          return acc;
        },
        {} as Record<string, number>,
      );

      const allStudents = await getStudents();
      const studs = allStudents
        .filter((s: Student) => room.students.some((st) => st.id === s.id))
        .map((s: Student) => ({
          ...s,
          id: s.id!,
          nome: s.nome || (s as any).username || "Aluno sem nome",
          totalAbsences: absencesMap[s.id!] ?? 0,
        })) as EnrolledStudent[];
      setStudents(studs);

      const preset: Record<string, { present: boolean; absent: boolean }> = {};
      studs.forEach((s) => (preset[s.id] = { present: true, absent: false }));
      if (mode !== "edit") setPresence(preset);

      setLoading(false);
    } catch {
      toast.error("Erro ao carregar dados");
      setLoading(false);
    }
  }, [classroomId, mode]);

  useEffect(() => {
    if (classroomId) loadClassroomData();
  }, [classroomId, loadClassroomData]);

  useEffect(() => {
    if (mode) {
      setAttendanceDate(getLocalDate());
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
        const preset: Record<string, { present: boolean; absent: boolean }> =
          {};
        const allAttendances = await getAttendancesByClassroom(classroomId);
        const filtered = allAttendances.filter(
          (a) =>
            a.schedule?.scheduleId === scheduleId &&
            a.attendanceDate.slice(0, 10) === attendanceDate,
        );

        if (mode === "create" && filtered.length > 0) {
          toast.error(
            "Já existe uma chamada registrada para este dia e horário.",
          );
          setMode(null);
          setIsLoadingPresence(false);
          return;
        }

        if (mode === "edit") {
          if (filtered.length === 0) {
            setHasAttendance(false);
            setPresence({});
            setIsLoadingPresence(false);
            return;
          }

          students.forEach((s) => {
            const att = filtered.find((f) => f.studentId === s.id);
            preset[s.id] = {
              present: att?.presence === true,
              absent: att?.presence === false,
            };
          });
        } else {
          students.forEach(
            (s) => (preset[s.id] = { present: true, absent: false }),
          );
          setHasAttendance(true);
        }

        setPresence(preset);
        setIsLoadingPresence(false);
      } catch {
        setIsLoadingPresence(false);
      }
    }

    loadPresence();
  }, [mode, scheduleId, attendanceDate, students, classroomId, isValidDay]);

  const handleSave = async () => {
    if (!scheduleId) return toast.error("Selecione um horário");
    if (!isValidDay)
      return toast.error("A data selecionada não é um dia de aula.");

    try {
      const isoDate = new Date(attendanceDate).toISOString();
      const existingAttendances = await getAttendancesByClassroom(classroomId);
      const filtered = existingAttendances.filter(
        (a) =>
          a.schedule?.scheduleId === scheduleId &&
          a.attendanceDate.slice(0, 10) === attendanceDate,
      );

      await Promise.all(
        students.map(async (s) => {
          const att = filtered.find((f) => f.studentId === s.id);
          const presenceValue = presence[s.id]?.present ?? false;
          if (att) await updateAttendance(att.id!, { presence: presenceValue });
          else
            await createAttendance({
              studentId: s.id,
              classroomId,
              scheduleId,
              attendanceDate: isoDate,
              presence: presenceValue,
            });
        }),
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
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.back()}
          className="hidden md:block px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white font-semibold w-max transition-colors cursor-pointer"
        >
          Voltar
        </button>

        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center flex-1 ml-6">
          Meu Horário
        </h1>
      </div>

      {!mode && (
        <>
          <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <input
                type="text"
                placeholder="Filtrar por aluno..."
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
              />
              <button
                onClick={() => {
                  setAttendanceDate(getLocalDate());
                  setScheduleId("");
                  setPresence({});
                  setIsLoadingPresence(false);
                  setHasAttendance(true);
                  setMode("create");
                }}
                className="w-full sm:w-auto bg-green-500/80 hover:bg-green-600/80 text-white font-medium px-6 py-2.5 rounded-xl shadow-md uppercase transition-all cursor-pointer"
              >
                Criar Chamada
              </button>
              <button
                onClick={() => setMode("edit")}
                className="w-full sm:w-auto bg-blue-500/80 hover:bg-blue-600/80 text-white font-medium px-6 py-2.5 rounded-xl shadow-md uppercase transition-all cursor-pointer"
              >
                Editar Chamada
              </button>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide mb-2">
              Resumo de Faltas
            </h2>
            <AttendanceTable students={filteredStudents} showAbsencesOnly />
          </div>
        </>
      )}

      {mode && (
        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow backdrop-blur-md space-y-6 mt-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="flex-1 w-full md:max-w-[220px]">
              <DatePicker
                value={attendanceDate}
                onChange={(newDate) => {
                  setAttendanceDate(newDate);
                  setScheduleId("");
                  setIsLoadingPresence(true);
                  setHasAttendance(true);
                }}
              />
            </div>

            <div
              className={`flex-1 w-full md:max-w-[220px] ${!isValidDay ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label className="block mb-1 text-sm text-gray-300">
                Horário
              </label>
              <Select
                value={scheduleId}
                onValueChange={(value) => {
                  setScheduleId(value);
                  if (value) {
                    setIsLoadingPresence(true);
                    setHasAttendance(true);
                  } else {
                    setIsLoadingPresence(false);
                  }
                }}
                disabled={!isValidDay}
              >
                <SelectTrigger className="w-full bg-black/30 border border-orange-500/40 text-white px-3 py-4.5 rounded-lg cursor-pointer">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent
                  className="bg-[#151a1b] text-white border border-orange-500/30"
                  position="popper"
                >
                  {filteredSchedules.map((s) => (
                    <SelectItem
                      key={s.scheduleId}
                      value={s.scheduleId}
                      className="cursor-pointer"
                    >
                      {s.dayOfWeek} — {s.startAt} às {s.endAt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Filtrar por aluno..."
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
              className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
          </div>

          {!isValidDay && (
            <p className="text-gray-400 text-center font-medium py-4 mt-4 bg-glass border border-orange-400/40 rounded-xl">
              A turma {classroom?.subject} não tem aula nesta data (
              {getDayName(attendanceDate).charAt(0).toUpperCase() +
                getDayName(attendanceDate).slice(1)}
              ).
            </p>
          )}

          {mode === "edit" && !hasAttendance && isValidDay && (
            <p className="text-gray-400 text-center font-medium py-4 mt-4 bg-glass border border-orange-400/40 rounded-xl">
              Não existe chamada registrada para este dia e horário.
            </p>
          )}

          {scheduleId && !isLoadingPresence && hasAttendance && isValidDay && (
            <>
              <AttendanceTable
                students={filteredStudents}
                scheduleId={scheduleId}
                presence={presence}
                togglePresence={togglePresence}
              />
              <button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 text-lg font-semibold rounded-xl shadow-lg mx-auto mt-4 cursor-pointer"
              >
                Salvar Chamada
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
