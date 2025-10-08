"use client";

import { useState } from "react";
import { Student } from "@/types/Student";

import { StudentTable } from "@/components/cadastro/StudentTable";
import { Modal } from "@/components/ui/modal";
import { StudentForm } from "@/components/cadastro/StudentForm";

export default function AlunosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  const addStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
    setIsModalOpen(false);
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter((s) => {
    const matchesName = s.nome.toLowerCase().includes(filterName.toLowerCase());
    const matchesCourse = s.curso
      .toLowerCase()
      .includes(filterCourse.toLowerCase());
    const matchesSemester = s.semestre
      .toLowerCase()
      .includes(filterSemester.toLowerCase());
    return matchesName && matchesCourse && matchesSemester;
  });

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 text-white flex flex-col">
      <h1 className="text-2xl font-medium mb-7 text-center uppercase">
        Cadastro de Alunos
      </h1>

      <div className="bg-neutral-800/60 backdrop-blur-sm border border-orange-400 rounded-xl p-4 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full sm:flex-1 border border-transparent bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
          />

          <input
            type="text"
            placeholder="Filtrar por curso..."
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full sm:flex-1 border border-transparent bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
          />

          <input
            type="text"
            placeholder="Filtrar por semestre..."
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full sm:w-48 border border-transparent bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto  bg-orange-500  hover:bg-transparent hover:border-1 hover:border-orange-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all cursor-pointer"
          >
            + Cadastrar
          </button>
        </div>
      </div>

      <StudentTable
        students={filteredStudents}
        onDelete={deleteStudent}
        onEdit={handleEdit}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editingStudent ? "Editar Aluno" : "Novo Aluno"}
        </h2>
        <StudentForm
          onAdd={addStudent}
          onEdit={updateStudent}
          editingStudent={editingStudent}
          students={students}
        />
      </Modal>
    </div>
  );
}
