"use client";

import { useState, useEffect } from "react";
import { CreateSubjectDTO, Subject } from "@/types/Subject";

interface SubjectFormProps {
  onAdd: (subject: CreateSubjectDTO) => Promise<void>;
  onEdit: (subject: Subject) => Promise<void>;
  editingSubject: Subject | null;
}

export default function SubjectForm({
  onAdd,
  onEdit,
  editingSubject,
}: SubjectFormProps) {
  const [formData, setFormData] = useState<Subject>({
    id: "",
    subjectName: "",
    workloadHours: 0,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingSubject) {
      setFormData(editingSubject);
    } else {
      setFormData({ id: "", subjectName: "", workloadHours: 0 });
    }
  }, [editingSubject]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "workloadHours"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));

    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subjectName || !formData.workloadHours) {
      setErrorMessage("Preencha todos os campos.");
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

      setFormData({ id: "", subjectName: "", workloadHours: 0 });
      setErrorMessage(null);
    } catch (error: any) {
      console.error("Erro ao salvar matéria:", error);
      setErrorMessage("Erro ao cadastrar matéria. Tente novamente.");
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
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 
                     transition-all text-white placeholder-gray-400 px-5 py-3 rounded-xl outline-none shadow-inner"
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
          className="no-spinner w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 
                     transition-all text-white placeholder-gray-400 px-5 py-3 rounded-xl outline-none shadow-inner"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 
                   hover:from-orange-500/60 hover:to-yellow-400/40 
                   text-white font-semibold px-6 py-3 rounded-xl 
                   transition-all uppercase cursor-pointer"
      >
        {editingSubject ? "Salvar Alterações" : "Cadastrar Matéria"}
      </button>

      {errorMessage && (
        <p className="text-red-500 text-center mt-2 font-semibold">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
