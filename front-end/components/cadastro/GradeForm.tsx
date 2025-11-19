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
  const [form, setForm] = useState<CreateGradeDTO>(
    initialData ?? {
      studentId: "",
      classroomId: "",
      activity: "",
      grade: 0,
    }
  );

  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
    getClassrooms().then(setClassrooms);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const st = await getStudents();

      const mappedStudents = st.map((student: any) => ({
        id: student.id,
        nome: student.username,
        email: student.email,
        curso: student.courseName ?? "",
        courseId: student.courseId ?? "",
      }));

      setStudents(mappedStudents);
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">

      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Aluno
        </label>

        <div className="relative">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
          />

          <select
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-11 py-3 rounded-xl outline-none cursor-pointer"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
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
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Turma
        </label>

        <div className="relative">
          <BookOpen
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
          />

          <select
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-11 py-3 rounded-xl outline-none cursor-pointer"
            value={form.classroomId}
            onChange={(e) => setForm({ ...form, classroomId: e.target.value })}
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
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Tipo da Atividade
        </label>

        <div className="relative">
          <ClipboardList
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
          />

          <select
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-11 py-3 rounded-xl outline-none cursor-pointer"
            value={form.activity}
            onChange={(e) => setForm({ ...form, activity: e.target.value })}
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
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Nota
        </label>

        <div className="relative">
          <FileText
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
          />

          <input
            type="number"
            step="0.1"
            placeholder="Nota"
            value={form.grade || ""}
            onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40
                       text-white px-11 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>

      <button
        className="w-full bg-gradient-to-r 
                   from-orange-500/50 to-yellow-400/30 
                   hover:from-orange-500/60 hover:to-yellow-400/40 
                   text-white font-semibold px-6 py-3 rounded-xl 
                   transition-all uppercase cursor-pointer"
      >
        Salvar
      </button>
    </form>
  );
}
