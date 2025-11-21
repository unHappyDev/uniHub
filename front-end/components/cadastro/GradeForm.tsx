"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Activity, CreateGradeDTO, Grade } from "@/types/Grade";
import { Classroom } from "@/types/Classroom";
import { User, ClipboardList, FileText, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  initialData?: CreateGradeDTO;
  onSubmit: (data: CreateGradeDTO) => void;
  classroom: Classroom;
  students: { id: string; nome: string }[];
  grades?: Grade[];
}

const activityLabels: Record<Activity, string> = {
  prova: "Prova",
  trabalho: "Trabalho",
  recuperacao: "Recuperação",
  extra: "Extra",
};

export default function GradeForm({
  initialData,
  onSubmit,
  classroom,
  students,
  grades = [],
}: Props) {
  const [form, setForm] = useState<CreateGradeDTO>(() => ({
    studentId: initialData?.studentId || "",
    classroomId: classroom.classroomId,
    activity: initialData?.activity ?? "prova",
    grade: initialData?.grade ?? 0,
    subject: classroom.subject,
  }));

  const [gradeInput, setGradeInput] = useState<string>(
    initialData?.grade !== undefined ? String(initialData.grade) : "",
  );

  useEffect(() => {
    if (!form.studentId) return;

    const existingGrade = grades.find(
      (g) => g.studentId === form.studentId && g.activity === form.activity,
    );

    setGradeInput(existingGrade ? String(existingGrade.grade) : "0");
    setForm((prev) => ({
      ...prev,
      grade: existingGrade ? existingGrade.grade : 0,
    }));
  }, [form.activity, form.studentId, grades]);

  const selectedStudent = students.find((s) => s.id === form.studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) {
      toast.warning("Selecione um aluno antes de salvar.");
      return;
    }
    onSubmit({ ...form, grade: Number(form.grade.toFixed(1)) });
  };

  const handleActivityChange = (value: Activity) => {
    setForm({ ...form, activity: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Aluno
        </label>
        <div className="relative bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <span>{selectedStudent?.nome || "Aluno não encontrado"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Turma
        </label>
        <div className="relative bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <span>
            {classroom.subject} — {classroom.semester}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Tipo da Atividade
        </label>
        <div className="relative">
          <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <Select value={form.activity} onValueChange={handleActivityChange}>
            <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-12 py-5 rounded-xl cursor-pointer">
              <SelectValue placeholder="Selecione a atividade" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(activityLabels).map(([key, label]) => (
                <SelectItem
                  className="cursor-pointer"
                  key={key}
                  value={key as Activity}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            min={0}
            max={10}
            placeholder="Digite a nota"
            value={gradeInput}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setGradeInput("");
                setForm({ ...form, grade: 0 });
                return;
              }
              const numberValue = Number(value);
              if (numberValue < 0) {
                toast.error("A nota não pode ser negativa.");
                return;
              }
              if (numberValue > 10) {
                toast.error("A nota máxima permitida é 10.");
                return;
              }
              const parts = value.split(".");
              if (parts[1] && parts[1].length > 1) {
                toast.error("A nota deve ter no máximo uma casa decimal.");
                return;
              }

              setGradeInput(value);
              setForm({ ...form, grade: numberValue });
            }}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white px-11 py-3 rounded-xl outline-none cursor-pointer no-spinner"
          />
        </div>
      </div>

      <button className="w-full bg-orange-500/70 hover:bg-orange-600/70 px-6 py-3 rounded-xl uppercase font-semibold cursor-pointer transition-all">
        Salvar
      </button>
    </form>
  );
}
