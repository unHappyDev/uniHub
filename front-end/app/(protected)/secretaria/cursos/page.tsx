"use client";

import { useState, useEffect } from "react";
import { Course, CreateCourseDTO } from "@/types/Course";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/api/course";
import CourseForm from "@/components/cadastro/CourseForm";
import CourseTable from "@/components/cadastro/CourseTable";

import { Modal } from "@/components/ui/modal";
import CourseSubjectsManager from "@/components/cadastro/CourseSubjecttManager";

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filterName, setFilterName] = useState("");
  const [managingCourse, setManagingCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 404) {
        setCourses([]);
      } else {
        console.error("Erro ao buscar cursos:", error?.message || error);
      }
    }
  };

  const handleAdd = async (course: CreateCourseDTO) => {
    await createCourse(course);
    await fetchCourses();
    setIsModalOpen(false);
  };

  const handleUpdate = async (course: Course) => {
    if (!course.id) return;
    await updateCourse(course.id, { courseName: course.courseName });
    await fetchCourses();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
  if (!confirm("Tem certeza que deseja excluir este curso?")) return;

  try {
    await deleteCourse(id);
    await fetchCourses();
  } catch (error: any) {
    if (error?.response?.status === 409) {
      alert("Não é possível excluir este curso pois há alunos vinculados a ele.");
    } else {
      alert("Erro ao excluir o curso.");
      console.error(error);
    }
  }
};

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCourse(null);
    setIsModalOpen(false);
  };

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(filterName.toLowerCase()),
  );

  const handleManageSubjects = (course: Course) => {
    setManagingCourse(course);
  };

  const closeSubjectsModal = () => {
    setManagingCourse(null);
    fetchCourses(); 
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
          Cadastro de Cursos
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-6 py-2.5 rounded-xl shadow-md uppercase transition-all cursor-pointer"
            >
              + Cadastrar
            </button>
          </div>
        </div>

        <CourseTable
          courses={filteredCourses}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onManageSubjects={handleManageSubjects}
        />

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
            {editingCourse ? "Editar Curso" : "Novo Curso"}
          </h2>
          <CourseForm
            onAdd={handleAdd}
            onEdit={handleUpdate}
            editingCourse={editingCourse}
          />
        </Modal>

        {managingCourse && (
          <Modal isOpen={!!managingCourse} onClose={closeSubjectsModal}>
            <CourseSubjectsManager
              course={managingCourse}
              onClose={closeSubjectsModal}
              onUpdated={fetchCourses}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
