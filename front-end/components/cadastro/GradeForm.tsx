"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Activity, CreateGradeDTO } from "@/types/Grade";
import { Classroom } from "@/types/Classroom";
import { User, ClipboardList, FileText, BookOpen } from "lucide-react";

interface Props {
  initialData?: CreateGradeDTO;
  onSubmit: (data: CreateGradeDTO) => void;
  classroom: Classroom;
  students: { id: string; nome: string }[];
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
}: Props) {
  const [form, setForm] = useState<CreateGradeDTO>({
    studentId: initialData?.studentId || "",
    classroomId: classroom.classroomId,
    activity: initialData?.activity ?? "prova",
    grade: initialData?.grade ?? 0,
    subject: classroom.subject,
  });

  const [gradeInput, setGradeInput] = useState<string>(
    initialData?.grade !== undefined ? String(initialData.grade) : "",
  );

  useEffect(() => {
    setForm({
      studentId: initialData?.studentId || "",
      classroomId: classroom.classroomId,
      activity: initialData?.activity ?? "prova",
      grade: initialData?.grade ?? 0,
      subject: classroom.subject,
    });

    setGradeInput(
      initialData?.grade !== undefined ? String(initialData.grade) : "",
    );
  }, [initialData, classroom]);

  const selectedStudent = students.find((s) => s.id === form.studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) {
      toast.warning("Selecione um aluno antes de salvar.");
      return;
    }

    onSubmit({
      ...form,
      grade: Number(form.grade.toFixed(1)),
    });
  };

  const handleActivityChange = (value: string) => {
    const activityEntry = Object.entries(activityLabels).find(
      ([key, label]) => label === value,
    );
    if (activityEntry) {
      setForm({ ...form, activity: activityEntry[0] as Activity });
    }
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
        {initialData?.activity ? (
          <div className="relative bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl">
            <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
            <span className="uppercase">
              {activityLabels[initialData.activity]}
            </span>
          </div>
        ) : (
          <div className="relative">
            <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
            <select
              value={activityLabels[form.activity]}
              onChange={(e) => handleActivityChange(e.target.value)}
              className="w-full bg-[#1a1a1dc3] border border-orange-400/40 px-11 py-3 rounded-xl"
            >
              {Object.entries(activityLabels).map(([key, label]) => (
                <option key={key} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
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
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-11 py-3 rounded-xl outline-none cursor-pointer
                       no-spinner"
          />
        </div>
      </div>

      <button className="w-full bg-orange-500/70 hover:bg-orange-600/70 px-6 py-3 rounded-xl uppercase font-semibold cursor-pointer transition-all">
        Salvar
      </button>
    </form>
  );
}
