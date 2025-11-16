"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateSubjectDTO, Subject } from "@/types/Subject";
import { BookOpen, Clock, User } from "lucide-react";

interface SubjectFormProps {
  onAdd: (subject: CreateSubjectDTO) => Promise<void>;
  onEdit: (subject: Subject) => Promise<void>;
  editingSubject: Subject | null;
  subjects: Subject[];
}

export default function SubjectForm({
  onAdd,
  onEdit,
  editingSubject,
  subjects,
}: SubjectFormProps) {
  const [formData, setFormData] = useState<Subject>({
    subjectId: "",
    subjectName: "",
    workloadHours: 0,
  });

  useEffect(() => {
    if (editingSubject) {
      setFormData(editingSubject);
    } else {
      setFormData({ subjectId: "", subjectName: "", workloadHours: 0 });
    }
  }, [editingSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "workloadHours" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subjectName || !formData.workloadHours) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    const nomeDuplicado = subjects.some(
      (s) =>
        s.subjectName.trim().toLowerCase() ===
          formData.subjectName.trim().toLowerCase() &&
        s.subjectId !== formData.subjectId,
    );

    if (nomeDuplicado) {
      toast.error("Já existe uma matéria com este nome.");
      return;
    }

    try {
      if (editingSubject) {
        await onEdit(formData);
      } else {
        const dto: CreateSubjectDTO = {
          subjectName: formData.subjectName,
          workloadHours: formData.workloadHours,
        };
        await onAdd(dto);
      }
      setFormData({ subjectId: "", subjectName: "", workloadHours: 0 });
    } catch {
      toast.error("Erro ao salvar matéria. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Nome da Matéria
        </label>

        <div className="relative">
          <BookOpen
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
            size={18}
          />
          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                     text-white px-11 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Carga Horária
        </label>

        <div className="relative">
          <Clock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
            size={18}
          />

          <input
            type="number"
            name="workloadHours"
            min="1"
            value={formData.workloadHours || ""}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                     text-white px-11 py-3 rounded-xl outline-none cursor-pointer
        no-spinner
      "
            placeholder="Ex: 40"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-6 py-3 rounded-xl transition-all uppercase cursor-pointer"
      >
        {editingSubject ? "Salvar Alterações" : "Cadastrar Matéria"}
      </button>
    </form>
  );
}
