"use client";

import { useState, useEffect } from "react";
import { Course, CreateCourseDTO } from "@/types/Course";

interface CourseFormProps {
  onAdd: (course: CreateCourseDTO) => Promise<void>;
  onEdit: (course: Course) => Promise<void>;
  editingCourse: Course | null;
}

export default function CourseForm({ onAdd, onEdit, editingCourse }: CourseFormProps) {
  const [formData, setFormData] = useState<CreateCourseDTO>({ courseName: "" });

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
    if (editingCourse) {
      await onEdit({ ...editingCourse, courseName: formData.courseName });
    } else {
      await onAdd(formData);
    }
    setFormData({ courseName: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white">
      <div>
        <label className="block text-sm mb-1 uppercase">Nome do Curso</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-5 py-3 rounded-xl outline-none shadow-inner"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-6 py-3 rounded-xl uppercase cursor-pointer transition-all"
      >
        {editingCourse ? "Salvar Alterações" : "Cadastrar Curso"}
      </button>
    </form>
  );
}
