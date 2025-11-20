"use client";

import { useState, useEffect } from "react";
import { CreateGradeDTO } from "@/types/Grade";
import { getStudents } from "@/lib/api/student";
import { getClassrooms } from "@/lib/api/classroom";
import { Classroom } from "@/types/Classroom";
import { Student } from "@/types/Student";
import { User, BookOpen, ClipboardList, FileText } from "lucide-react";

interface Props {
  initialData?: CreateGradeDTO;
  onSubmit: (data: CreateGradeDTO) => void;
}

export default function GradeForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<CreateGradeDTO>({
    studentId: "",
    classroomId: "",
    subject: "",
    activity: "",
    grade: 0,
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    getStudents().then((st) =>
      setStudents(
        st.map((s: any) => ({
          id: s.id,
          nome: s.username || s.nome,
        }))
      )
    );
    getClassrooms().then(setClassrooms);
  }, []);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80">
          Aluno
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <select
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl"
          >
            <option value="">Selecione o aluno</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80">
          Turma
        </label>
        <div className="relative">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <select
            value={form.classroomId}
            onChange={(e) => setForm({ ...form, classroomId: e.target.value })}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl"
          >
            <option value="">Selecione a turma</option>
            {classrooms.map((c) => (
              <option key={c.classroomId} value={c.classroomId}>
                {c.subject} — {c.semester}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80">
          Tipo da Atividade
        </label>
        <div className="relative">
          <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <select
            value={form.activity}
            onChange={(e) => setForm({ ...form, activity: e.target.value })}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl"
          >
            <option value="">Selecione a atividade</option>
            <option value="prova">Prova</option>
            <option value="trabalho">Trabalho</option>
            <option value="recuperacao">Recuperação</option>
            <option value="extra">Extra</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80">
          Nota
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <input
            type="number"
            step="0.1"
            value={form.grade}
            onChange={(e) =>
              setForm({ ...form, grade: Number(e.target.value) })
            }
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl"
          />
        </div>
      </div>

      <button className="w-full bg-orange-500/50 hover:bg-orange-500/70 px-6 py-3 rounded-xl uppercase font-semibold">
        Salvar
      </button>
    </form>
  );
}
