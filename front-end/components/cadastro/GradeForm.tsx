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
    bimester: initialData?.bimester ?? 1,
  }));

  const [gradeInput, setGradeInput] = useState<string>(
    initialData?.grade !== undefined ? String(initialData.grade) : "",
  );

  useEffect(() => {
    if (!form.studentId) return;

    const existingGrade = grades.find(
      (g) =>
        g.studentId === form.studentId &&
        g.activity === form.activity &&
        g.bimester === form.bimester,
    );

    setGradeInput(existingGrade ? String(existingGrade.grade) : "0");
    setForm((prev) => ({
      ...prev,
      grade: existingGrade ? existingGrade.grade : 0,
    }));
  }, [form.activity, form.studentId, form.bimester, grades]);

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

  const getMaxGrade = (activity: Activity) => {
    if (activity === "prova" || activity === "recuperacao") return 8;
    if (activity === "trabalho") return 2;
    return 10; // extra
  };

  const [warning, setWarning] = useState<string>("");

  const handleGradeChange = (value: string) => {
    let numberValue = Number(value);
    const max = getMaxGrade(form.activity);

    if (numberValue > max) {
      numberValue = max;
      setWarning(`O máximo para ${activityLabels[form.activity]} é ${max}`);
    } else {
      setWarning("");
    }
    if (numberValue < 0) numberValue = 0;

    setGradeInput(String(numberValue));
    setForm({ ...form, grade: numberValue });
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
                <SelectItem key={key} value={key as Activity}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Nota
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
          <input
            type="number"
            step="0.1"
            min={0}
            max={getMaxGrade(form.activity)}
            placeholder="Digite a nota"
            value={gradeInput}
            onChange={(e) => handleGradeChange(e.target.value)}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white px-11 py-3 rounded-xl outline-none cursor-pointer no-spinner"
          />
        </div>
        {warning && <p className="text-red-400 text-sm mt-1">{warning}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase text-orange-300/80">
          Bimestre
        </label>
        <select
          value={form.bimester}
          onChange={(e) =>
            setForm({ ...form, bimester: parseInt(e.target.value) })
          }
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white px-4 py-3 rounded-xl"
        >
          <option value={1}>1º Bimestre</option>
          <option value={2}>2º Bimestre</option>
        </select>
      </div>

      <button className="w-full bg-orange-500/70 hover:bg-orange-600/70 px-6 py-3 rounded-xl uppercase font-semibold cursor-pointer transition-all">
        Salvar
      </button>
    </form>
  );
}
