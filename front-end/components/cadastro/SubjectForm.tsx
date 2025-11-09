"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateSubjectDTO, Subject } from "@/types/Subject";

interface SubjectFormProps {
  onAdd: (subject: CreateSubjectDTO) => Promise<void>;
  onEdit: (subject: Subject) => Promise<void>;
  editingSubject: Subject | null;
  subjects: Subject[];
}

export default function SubjectForm({ onAdd, onEdit, editingSubject, subjects }: SubjectFormProps) {
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
        s.subjectName.trim().toLowerCase() === formData.subjectName.trim().toLowerCase() &&
        s.subjectId !== formData.subjectId
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
      <div>
        <label className="block text-sm mb-1 uppercase">Nome da Matéria</label>
        <input
          type="text"
          name="subjectName"
          value={formData.subjectName}
          onChange={handleChange}
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 transition-all text-white px-5 py-3 rounded-xl shadow-inner"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 uppercase">Carga Horária</label>
        <input
          type="number"
          name="workloadHours"
          min="1"
          value={formData.workloadHours || ""}
          onChange={handleChange}
          required
          
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40
             transition-all text-white px-5 py-3 rounded-xl shadow-inner no-spinner"
        />
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
