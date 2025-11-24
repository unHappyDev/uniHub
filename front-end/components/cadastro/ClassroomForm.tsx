"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  CreateClassroomDTO,
  Classroom,
  ClassroomSchedule,
  ClassroomStudent,
} from "@/types/Classroom";
import { getTeachers } from "@/lib/api/teacher";
import { getSubjects } from "@/lib/api/subject";
import { getStudents } from "@/lib/api/student";
import {
  createClassroom,
  updateClassroom,
  addStudentsToClassroom,
  removeStudentsFromClassroom,
  getClassrooms,
} from "@/lib/api/classroom";
import {
  updateSchedule,
  createSchedules,
  deleteSchedule,
  SchedulePayload,
} from "@/lib/api/schedule";
import { Teacher } from "@/types/Teacher";
import { Subject } from "@/types/Subject";
import { Student } from "@/types/Student";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  classroom?: Classroom | null;
  onSaved: () => void;
  onClose: () => void;
}

const WEEK_DAYS = [
  { value: "SEGUNDA", label: "Segunda-feira" },
  { value: "TERCA", label: "Terça-feira" },
  { value: "QUARTA", label: "Quarta-feira" },
  { value: "QUINTA", label: "Quinta-feira" },
  { value: "SEXTA", label: "Sexta-feira" },
];

const FIXED_INTERVALS = [
  "07:45 → 08:35",
  "08:35 → 09:25",
  "09:40 → 10:30",
  "10:30 → 11:20",
  "19:00 → 19:50",
  "19:50 → 20:40",
  "20:55 → 21:45",
  "21:45 → 22:35",
];

export default function ClassroomForm({ classroom, onSaved, onClose }: Props) {
  const [formData, setFormData] = useState<CreateClassroomDTO>({
    professorId: "",
    subjectId: "",
    semester: "",
    schedules: [],
    studentsIds: [],
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);

  const initialScheduleIdsRef = useRef<string[]>([]);
  const errorToastRef = useRef(false);

  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        { scheduleId: null, dayOfWeek: "", startAt: "", endAt: "" },
      ],
    }));
  };

  const updateScheduleField = (
    index: number,
    field: keyof ClassroomSchedule,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.schedules];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, schedules: updated };
    });
  };

  const removeScheduleField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const formatTime = (time: string | null | undefined) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

   useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, s, st] = await Promise.all([
          getTeachers(),
          getSubjects(),
          getStudents(),
        ]);

        const mappedTeachers = t.map((teacher: any) => ({
          id: teacher.id,
          nome: teacher.username,
          email: teacher.email,
        }));
        setTeachers(mappedTeachers);

        setSubjects(s);

        const mappedStudents: Student[] = st.map((student: any) => ({
          id: student.id,
          nome: student.username,
          email: student.email,
          curso: student.courseName ?? "",
          courseId: student.courseId ?? "",
        }));
        setStudents(mappedStudents);

        try {
          const cls = await getClassrooms();
          setAllClassrooms(cls);
        } catch (err: any) {
          if (err?.response?.status === 404) {
            setAllClassrooms([]);
          } else {
            console.error(err);
            toast.error("Erro ao carregar turmas.");
          }
        }

        if (classroom) {
          initialScheduleIdsRef.current = classroom.schedules
            .map((sch) => sch.scheduleId)
            .filter((id): id is string => !!id);

          const normalize = (str: string) =>
            str
              ? str
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .trim()
              : "";

          const matchedTeacher = mappedTeachers.find(
            (teacher) =>
              normalize(teacher.nome) === normalize(classroom.professor),
          );
          const matchedTeacherId = matchedTeacher?.id ?? "";

          const matchedSubject = s.find(
            (sub: Subject) =>
              normalize(sub.subjectName) === normalize(classroom.subject),
          );

          const matchedStudentsIds = classroom.students
            .map((st: ClassroomStudent) => {
              const found = mappedStudents.find(
                (stu: Student) => normalize(stu.nome) === normalize(st.name),
              );
              return found?.id;
            })
            .filter(Boolean) as string[];

          setFormData({
            professorId: matchedTeacherId,
            subjectId: matchedSubject?.subjectId ?? "",
            semester: classroom.semester ?? "",
            schedules: classroom.schedules.map((sch) => ({
              scheduleId: sch.scheduleId ?? null,
              dayOfWeek: sch.dayOfWeek ?? "",
              startAt: formatTime(sch.startAt),
              endAt: formatTime(sch.endAt),
            })),
            studentsIds: matchedStudentsIds,
          });
        }

        errorToastRef.current = false;
      } catch (err) {
        console.error(err);
        if (!errorToastRef.current) {
          toast.error("Erro ao carregar dados.");
          errorToastRef.current = true;
        }
      }
    };

    fetchData();
  }, [classroom]);

  const toggleStudentSelection = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      studentsIds: prev.studentsIds.includes(id)
        ? prev.studentsIds.filter((s) => s !== id)
        : [...prev.studentsIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const classesInSemester = allClassrooms.filter(
      (c) => c.semester === formData.semester.trim(),
    );

    if (!classroom && classesInSemester.length >= 5) {
      toast.error("Limite de 5 matérias por semestre atingido.");
      setIsSubmitting(false);
      return;
    }

    if (classroom && classroom.semester !== formData.semester.trim()) {
      if (classesInSemester.length >= 5) {
        toast.error("Este semestre já possui 5 matérias cadastradas.");
        setIsSubmitting(false);
        return;
      }
    }

    if (!formData.professorId) {
      toast.error("Selecione um professor.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.subjectId) {
      toast.error("Selecione uma matéria.");
      setIsSubmitting(false);
      return;
    }

    if (formData.schedules.length === 0) {
      toast.error("Adicione pelo menos um horário.");
      setIsSubmitting(false);
      return;
    }

    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    for (const s of formData.schedules) {
      if (!s.startAt || !s.endAt) {
        toast.error("Preencha horário de início e fim.");
        setIsSubmitting(false);
        return;
      }

      const duration = toMin(s.endAt) - toMin(s.startAt);

      if (duration <= 0) {
        toast.error("O horário de fim deve ser maior que o horário de início.");
        setIsSubmitting(false);
        return;
      }

      if (duration > 50) {
        toast.error("A duração máxima permitida é de 50 minutos.");
        setIsSubmitting(false);
        return;
      }
    }

    for (const newSched of formData.schedules) {
      const conflict = allClassrooms.some((c) => {
        if (classroom && c.classroomId === classroom.classroomId) return false;

        if (c.semester !== formData.semester.trim()) return false;

        return c.schedules.some((oldSched) => {
          if (oldSched.dayOfWeek !== newSched.dayOfWeek) return false;

          const newStart = toMin(newSched.startAt);
          const newEnd = toMin(newSched.endAt);

          const oldStart = toMin(oldSched.startAt.substring(0, 5));
          const oldEnd = toMin(oldSched.endAt.substring(0, 5));

          return newStart < oldEnd && newEnd > oldStart;
        });
      });

      if (conflict) {
        toast.error(
          "Já existe outra turma com esse dia e horário neste semestre.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    const selectedProfessorName = teachers.find(
      (t) => t.id === formData.professorId,
    )?.nome;

    for (const newSched of formData.schedules) {
      const conflictTeacher = allClassrooms.some((c) => {
        if (classroom && c.classroomId === classroom.classroomId) return false;

        if (c.professor !== selectedProfessorName) return false;

        return c.schedules.some((oldSched) => {
          if (oldSched.dayOfWeek !== newSched.dayOfWeek) return false;

          const newStart = toMin(newSched.startAt);
          const newEnd = toMin(newSched.endAt);

          const oldStart = toMin(oldSched.startAt.substring(0, 5));
          const oldEnd = toMin(oldSched.endAt.substring(0, 5));

          return newStart < oldEnd && newEnd > oldStart;
        });
      });

      if (conflictTeacher) {
        toast.error("Este professor já possui uma aula neste horário.");
        setIsSubmitting(false);
        return;
      }
    }

    for (const newSched of formData.schedules) {
      for (const studentId of formData.studentsIds) {
        const conflict = allClassrooms.some((c) => {
          if (classroom && c.classroomId === classroom.classroomId)
            return false;

          if (!c.students.some((s) => s.id === studentId)) return false;

          return c.schedules.some((oldSched) => {
            if (oldSched.dayOfWeek !== newSched.dayOfWeek) return false;

            const newStart = toMin(newSched.startAt);
            const newEnd = toMin(newSched.endAt);

            const oldStart = toMin(oldSched.startAt.substring(0, 5));
            const oldEnd = toMin(oldSched.endAt.substring(0, 5));

            return newStart < oldEnd && newEnd > oldStart;
          });
        });

        if (conflict) {
          toast.error(
            "Um aluno selecionado já tem uma aula nesse mesmo horário em outro semestre.",
          );
          setIsSubmitting(false);
          return;
        }
      }
    }

    const classroomPayload: CreateClassroomDTO = {
      professorId: formData.professorId,
      subjectId: formData.subjectId,
      semester: formData.semester.trim(),
      schedules: formData.schedules,
      studentsIds: formData.studentsIds,
    };

    try {
      if (classroom) {
        await updateClassroom(classroom.classroomId, classroomPayload);

        for (const sched of formData.schedules) {
          const payload: SchedulePayload = {
            scheduleId: sched.scheduleId ?? null,
            dayOfWeek: sched.dayOfWeek,
            startAt: sched.startAt,
            endAt: sched.endAt,
          };

          if (sched.scheduleId) await updateSchedule(sched.scheduleId, payload);
          else await createSchedules(classroom.classroomId, [payload]);
        }

        const currentIds = formData.schedules
          .map((s) => s.scheduleId)
          .filter((id): id is string => !!id);

        for (const origId of initialScheduleIdsRef.current) {
          if (!currentIds.includes(origId)) await deleteSchedule(origId);
        }

        const initialStudentIds = classroom.students
          .map((s) => {
            const found = students.find((stu) => {
              const normalize = (str: string) =>
                str
                  ? str
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .trim()
                  : "";
              return normalize(stu.nome) === normalize(s.name);
            });
            return found?.id;
          })
          .filter(Boolean) as string[];

        const studentsToAdd = formData.studentsIds.filter(
          (id) => !initialStudentIds.includes(id),
        );
        const studentsToRemove = initialStudentIds.filter(
          (id) => !formData.studentsIds.includes(id),
        );

        if (studentsToAdd.length)
          await addStudentsToClassroom(classroom.classroomId, studentsToAdd);
        if (studentsToRemove.length)
          await removeStudentsFromClassroom(
            classroom.classroomId,
            studentsToRemove,
          );

        toast.success("Turma atualizada com sucesso!");
      } else {
        await createClassroom(classroomPayload);
        toast.success("Turma criada com sucesso!");
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar turma.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white">
      <div>
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Professor
        </label>
        <Select
          value={formData.professorId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, professorId: value }))
          }
        >
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 py-5 text-white cursor-pointer">
            <SelectValue placeholder="Selecione um professor" />
          </SelectTrigger>
          <SelectContent className="bg-[#151a1b] text-white">
            {teachers.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Matéria
        </label>
        <Select
          value={formData.subjectId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, subjectId: value }))
          }
        >
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 py-5 text-white cursor-pointer">
            <SelectValue placeholder="Selecione uma matéria" />
          </SelectTrigger>
          <SelectContent className="bg-[#151a1b] text-white">
            {subjects.map((s) => (
              <SelectItem key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Semestre
        </label>
        <input
          type="text"
          value={formData.semester}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, semester: e.target.value }))
          }
          placeholder="Ex: 2025.1"
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white px-5 py-2 outline-none rounded-xl cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Horários
        </label>

        {formData.schedules.map((s, i) => (
          <div key={i} className="flex flex-wrap items-center gap-4 mb-3">
            <Select
              value={s.dayOfWeek}
              onValueChange={(value) =>
                updateScheduleField(i, "dayOfWeek", value)
              }
            >
              <SelectTrigger className="w-40 bg-black/30 border border-orange-500/40 text-white px-3 py-2 rounded cursor-pointer">
                <SelectValue placeholder="Dia da semana" />
              </SelectTrigger>
              <SelectContent className="bg-[#151a1b] text-white">
                {WEEK_DAYS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={s.startAt ? `${s.startAt} → ${s.endAt}` : ""}
              onValueChange={(value) => {
                const [start, end] = value.split(" → ");
                updateScheduleField(i, "startAt", start);
                updateScheduleField(i, "endAt", end);
              }}
            >
              <SelectTrigger className="w-48 bg-black/30 border border-orange-500/40 text-white px-3 py-2 rounded cursor-pointer">
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent className="bg-[#151a1b] text-white">
                {FIXED_INTERVALS.map((interval) => (
                  <SelectItem key={interval} value={interval}>
                    {interval}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              onClick={() => removeScheduleField(i)}
              className="bg-red-500/60 hover:bg-red-500/80 text-white rounded px-3 py-1 text-sm cursor-pointer"
            >
              Remover
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={addSchedule}
          className="mt-2 bg-orange-500/70 hover:bg-orange-600/70 text-white rounded px-4 py-2 cursor-pointer"
        >
          + Adicionar horário
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Alunos
        </label>

        <Dialog open={studentsDialogOpen} onOpenChange={setStudentsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#1a1a1dc3] hover:bg-[#222] border border-orange-400/40 text-white px-5 py-5 rounded-xl cursor-pointer">
              {formData.studentsIds.length > 0
                ? `${formData.studentsIds.length} aluno(s) selecionado(s)`
                : "Selecionar alunos"}
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#111] border border-orange-400/40 text-white">
            <DialogHeader>
              <DialogTitle>Selecionar alunos</DialogTitle>
            </DialogHeader>

            <div className="max-h-64 overflow-y-auto space-y-2 mt-4">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center space-x-3 rounded-md px-3 py-2 hover:bg-[#222]"
                >
                  <Checkbox
                    id={s.id}
                    checked={formData.studentsIds.includes(s.id!)}
                    onCheckedChange={() => toggleStudentSelection(s.id!)}
                  />
                  <label htmlFor={s.id}>{s.nome}</label>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setStudentsDialogOpen(false)}
                className="bg-orange-500/50 hover:bg-orange-500/60 text-white px-4 py-2 rounded cursor-pointer"
              >
                Concluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl cursor-pointer"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          className="bg-orange-500/70 hover:bg-orange-600/70 text-white px-4 py-3 rounded-xl cursor-pointer"
        >
          {classroom ? "Salvar Alterações" : "Cadastrar Turma"}
        </Button>
      </div>
    </form>
  );
}
