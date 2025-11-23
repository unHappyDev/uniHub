"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Course, CreateCourseDTO } from "@/types/Course";
import { GraduationCap } from "lucide-react";

interface CourseFormProps {
  onAdd: (course: CreateCourseDTO) => Promise<void>;
  onEdit: (course: Course) => Promise<void>;
  editingCourse: Course | null;
}

export default function CourseForm({ onAdd, onEdit, editingCourse }: CourseFormProps) {
  const [formData, setFormData] = useState<CreateCourseDTO>({ courseName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCourse) {
      setFormData({ courseName: editingCourse.courseName });
    } else {
      setFormData({ courseName: "" });
    }
  }, [editingCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, courseName: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseName.trim()) {
      toast.error("O nome do curso não pode estar vazio!");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCourse) {
        await onEdit({ ...editingCourse, courseName: formData.courseName });
      } else {
        await onAdd(formData);
      }
      setFormData({ courseName: "" });
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast.error("Erro ao salvar o curso. Verifique o console para detalhes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white">
      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Nome
        </label>

        <div className="relative">
          <GraduationCap
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
            size={18}
          />
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                     text-white px-10 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-orange-500/70 hover:bg-orange-600/70 
          text-white font-semibold px-6 py-3 rounded-xl uppercase 
          cursor-pointer transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isSubmitting
          ? "Salvando..."
          : editingCourse
          ? "Salvar Alterações"
          : "Cadastrar Curso"}
      </button>
    </form>
  );
}
