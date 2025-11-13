"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { CreateClassroomDTO, Classroom } from "@/types/Classroom";
import { getTeachers } from "@/lib/api/teacher";
import { getSubjects } from "@/lib/api/subject";
import { getStudents } from "@/lib/api/student";
import {
  createClassroom,
  updateClassroom,
  addStudentsToClassroom,
  removeStudentsFromClassroom,
} from "@/lib/api/classroom";
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

export default function ClassroomForm({ classroom, onSaved, onClose }: Props) {
  const [formData, setFormData] = useState<CreateClassroomDTO>({
    professorId: "",
    subjectId: "",
    semester: "",
    startAt: "",
    endAt: "",
    studentsIds: [],
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorToastRef = useRef(false);

  const formatDateForInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, s, st] = await Promise.all([
          getTeachers(),
          getSubjects(),
          getStudents(),
        ]);

        const mappedTeachers: Teacher[] = t.map((teacher: any) => ({
          id: teacher.id,
          nome: teacher.username,
          email: teacher.email,
        }));

        const mappedStudents: Student[] = st.map((student: any) => ({
          id: student.id,
          nome: student.username,
          email: student.email,
          curso: student.courseName ?? "",
          courseId: student.courseId ?? "",
        }));

        setTeachers(mappedTeachers);
        setSubjects(s);
        setStudents(mappedStudents);

        if (classroom) {
          const normalize = (str: string) =>
            str
              ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
              : "";

          const matchedTeacher = mappedTeachers.find(
            (t) => normalize(t.nome) === normalize(classroom.professor)
          );

          const matchedSubject = s.find(
            (sub: Subject) => normalize(sub.subjectName) === normalize(classroom.subject)
          );

          const matchedStudents = classroom.students
            .map((st) => {
              const found = mappedStudents.find(
                (stu) => normalize(stu.nome) === normalize(st.name)
              );
              return found?.id;
            })
            .filter(Boolean) as string[];

          setFormData({
            professorId: matchedTeacher?.id ?? "",
            subjectId: matchedSubject?.subjectId ?? "",
            semester: classroom.semester ?? "",
            startAt: classroom.startAt ? formatDateForInput(classroom.startAt) : "",
            endAt: classroom.endAt ? formatDateForInput(classroom.endAt) : "",
            studentsIds: matchedStudents,
          });
        }

        errorToastRef.current = false; 
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        if (!errorToastRef.current) {
          toast.error("Erro ao carregar dados.");
          errorToastRef.current = true;
        }
      }
    };

    fetchData();
  }, [classroom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    const payload: CreateClassroomDTO = {
      professorId: formData.professorId?.trim(),
      subjectId: formData.subjectId?.trim(),
      semester: formData.semester?.trim() || " ",
      startAt: new Date(formData.startAt).toISOString(),
      endAt: new Date(formData.endAt).toISOString(),
      studentsIds: formData.studentsIds.map((id) => id.trim()),
    };

    try {
      if (classroom) {
        await updateClassroom(classroom.classroomId, payload);

        const normalize = (s: string) =>
          s
            ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
            : "";

        const oldStudentIds: string[] =
          (classroom.students || [])
            .map((st) => {
              const found = students.find(
                (s) => normalize(s.nome) === normalize(st.name)
              );
              return found?.id;
            })
            .filter(Boolean) as string[] || [];

        const newStudentIds = formData.studentsIds || [];
        const toAdd = newStudentIds.filter((id) => !oldStudentIds.includes(id));
        const toRemove = oldStudentIds.filter((id) => !newStudentIds.includes(id));

        const calls: Promise<any>[] = [];
        if (toAdd.length > 0) calls.push(addStudentsToClassroom(classroom.classroomId, toAdd));
        if (toRemove.length > 0) calls.push(removeStudentsFromClassroom(classroom.classroomId, toRemove));
        if (calls.length > 0) await Promise.all(calls);

        toast.success("Turma atualizada com sucesso!");
      } else {
        await createClassroom(payload);
        toast.success("Turma criada com sucesso!");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      toast.error("Erro ao salvar turma.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white">
      {/* Professor */}
      <div>
        <label className="block text-sm mb-1 uppercase">Professor</label>
        <Select
          value={formData.professorId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, professorId: value }))
          }
        >
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white cursor-pointer">
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

      {/* Matéria */}
      <div>
        <label className="block text-sm mb-1 uppercase">Matéria</label>
        <Select
          value={formData.subjectId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, subjectId: value }))
          }
        >
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white cursor-pointer">
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

      {/* Semestre */}
      <div>
        <label className="block text-sm mb-1 uppercase">Semestre</label>
        <input
          type="text"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          placeholder="Ex: 2025.1"
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                     text-white px-5 py-3 rounded-xl outline-none cursor-pointer"
        />
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1 uppercase">Início</label>
          <input
            type="datetime-local"
            name="startAt"
            value={formData.startAt}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-5 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 uppercase">Término</label>
          <input
            type="datetime-local"
            name="endAt"
            value={formData.endAt}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-5 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Alunos */}
      <div>
        <label className="block text-sm mb-1 uppercase">Alunos</label>
        <Dialog open={studentsDialogOpen} onOpenChange={setStudentsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                         text-white px-5 py-3 rounded-xl justify-between cursor-pointer"
            >
              {formData.studentsIds.length > 0
                ? `${formData.studentsIds.length} aluno(s) selecionado(s)`
                : "Selecionar alunos"}
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#111] border border-orange-400/40 text-white cursor-pointer">
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
                className="bg-gradient-to-r from-orange-500/50 to-yellow-400/30 
                           hover:from-orange-500/60 hover:to-yellow-400/40 
                           text-white font-semibold px-4 py-3 rounded-xl uppercase cursor-pointer"
              >
                Concluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-xl uppercase cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-4 py-3 rounded-xl uppercase cursor-pointer"
        >
          {classroom ? "Salvar Alterações" : "Cadastrar Turma"}
        </Button>
      </div>
    </form>
  );
}
