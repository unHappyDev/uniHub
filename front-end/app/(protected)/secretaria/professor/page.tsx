"use client";

import { useEffect, useState } from "react";
import { Teacher, CreateTeacherDTO } from "@/types/Teacher";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/lib/api/teacher";
import TeacherForm from "@/components/cadastro/TeacherForm";
import TeacherTable from "@/components/cadastro/TeacherTable";
import { Modal } from "@/components/ui/modal";

const DEFAULT_PASSWORD = "12341234";

export default function ProfessoresPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [filterName, setFilterName] = useState("");

  const fetchTeachers = async () => {
    const data = await getTeachers();

    const normalized: Teacher[] = Array.isArray(data)
      ? data.map((t: any, i: number) => ({
          id: t.id?.toString() ?? String(i + 1),
          nome: t.nome ?? t.name ?? t.username ?? "",
          email: t.email ?? "",
        }))
      : [];

    setTeachers(normalized);
  };

  const handleAdd = async (teacherDTO: CreateTeacherDTO) => {
    await createTeacher(teacherDTO);
    await fetchTeachers();
    setIsModalOpen(false);
  };

  const handleEdit = async (id: string, teacherDTO: CreateTeacherDTO) => {
    await updateTeacher(id, teacherDTO);
    await fetchTeachers();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este professor?")) {
      await deleteTeacher(id);
      await fetchTeachers();
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.nome.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="p-8 text-white flex flex-col">
      <h1 className="text-2xl font-medium mb-7 text-center uppercase">
        Cadastro de Professores
      </h1>

      {/* Filtro + botão */}
      <div className="bg-neutral-800/60 backdrop-blur-sm border border-orange-400 rounded-xl p-4 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full sm:flex-1 border border-transparent bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-orange-500 hover:bg-transparent hover:border-1 hover:border-orange-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all cursor-pointer"
          >
            + Cadastrar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <TeacherTable
        teachers={filteredTeachers}
        onDelete={handleDelete}
        onEdit={(teacher) => {
          setEditingTeacher(teacher);
          setIsModalOpen(true);
        }}
      />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editingTeacher ? "Editar Professor" : "Novo Professor"}
        </h2>
        <TeacherForm
          onAdd={handleAdd}
          onEdit={handleEdit}
          editingTeacher={editingTeacher}
        />
      </Modal>
    </div>
  );
}
