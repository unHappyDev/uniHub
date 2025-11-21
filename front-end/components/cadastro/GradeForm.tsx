"use client";
import { useState, useEffect } from "react";
import { Activity, CreateGradeDTO } from "@/types/Grade";
import { Classroom } from "@/types/Classroom";
import { User, ClipboardList, FileText, BookOpen } from "lucide-react";

interface Props {
  initialData?: CreateGradeDTO & { student?: string };
  onSubmit: (data: CreateGradeDTO) => void;
  classroom: Classroom;
  students: { id: string; nome: string }[];
}

export default function GradeForm({ initialData, onSubmit, classroom }: Props) {
  console.log("📌 GradeForm MONTANDO...");
  console.log("➡️ initialData recebido:", initialData);
  console.log("➡️ classroom recebido:", classroom);

  const [form, setForm] = useState<CreateGradeDTO>({
    studentId: initialData?.studentId || "",
    classroomId: classroom.classroomId,
    subject: classroom.subject,
    activity: initialData?.activity ?? "prova",
    grade: initialData?.grade ?? 0,
  });

  console.log("🧩 Form state inicial:", form);

  useEffect(() => {
    console.log("🔄 useEffect disparou (initialData mudou!)");
    if (initialData) {
      console.log("📥 Atualizando form via initialData:", initialData);
      setForm({
        studentId: initialData.studentId || "",
        classroomId: classroom.classroomId,
        subject: classroom.subject,
        activity: initialData.activity ?? "prova",
        grade: initialData.grade ?? 0,
      });
    }
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("📤 Tentando enviar formulário...");
    console.log("📌 Form final antes do submit:", form);

    if (!form.studentId) {
      console.warn("⚠️ ERRO: studentId está vazio!");
      alert("Aluno não selecionado");
      return;
    }

    console.log("✅ Enviando para onSubmit:", form);
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Aluno
        </label>
        <div className="relative bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <span>{initialData?.student || "Aluno não encontrado"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Turma
        </label>
        <div className="relative bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <span>{classroom.subject} — {classroom.semester}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Tipo da Atividade
        </label>
        <div className="relative">
          <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <select
            value={form.activity}
            onChange={(e) => setForm({ ...form, activity: e.target.value as Activity })}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl"
          >
            <option value="" disabled>Selecione</option>
            <option value="prova">Prova</option>
            <option value="trabalho">Trabalho</option>
            <option value="recuperacao">Recuperação</option>
            <option value="extra">Extra</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Nota
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <input
            type="number"
            step="0.1"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
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
