"use client";

import { useEffect, useState } from "react";
import { Student } from "@/types/Student";
import { getCourses } from "@/lib/api/course";

interface Course {
  id: string;
  nome: string;
}

interface StudentFormProps {
  onAdd: (student: Student) => Promise<void>;
  onEdit: (student: Student) => Promise<void>;
  editingStudent: Student | null;
  students: Student[];
}

export default function StudentForm({
  onAdd,
  onEdit,
  editingStudent,
}: StudentFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    semestre: "",
    courseId: "", // ✅ usar courseId (não cursoId)
  });

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        nome: editingStudent.nome || "",
        email: editingStudent.email || "",
        semestre: editingStudent.semestre || "",
        courseId: editingStudent.courseId || "",
      });
    } else {
      setFormData({ nome: "", email: "", semestre: "", courseId: "" });
    }
  }, [editingStudent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCourse = courses.find((c) => c.id === formData.courseId);

    const studentData: Student = {
      nome: formData.nome,
      email: formData.email,
      semestre: formData.semestre,
      curso: selectedCourse?.nome || "",
      courseId: formData.courseId,
    };

    if (editingStudent) {
      await onEdit({ ...editingStudent, ...studentData });
    } else {
      await onAdd(studentData);
    }

    setFormData({ nome: "", email: "", semestre: "", courseId: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <label className="block text-sm mb-1">Nome</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Semestre</label>
        <input
          type="text"
          name="semestre"
          value={formData.semestre}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Curso</label>
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        >
          <option value="">Selecione um curso</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.nome}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-transparent border hover:border-orange-500 text-white font-semibold px-6 py-2 rounded-lg transition-all cursor-pointer"
      >
        {editingStudent ? "Salvar Alterações" : "Cadastrar Aluno"}
      </button>
    </form>
  );
}
