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
import { toast } from "sonner";

const DEFAULT_PASSWORD = "12341234";

export default function ProfessoresPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [filterName, setFilterName] = useState("");

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      const normalized: Teacher[] = Array.isArray(data)
        ? data.map((t: any, i: number) => ({
            id: t.id?.toString() ?? String(i + 1),
            nome: t.nome ?? t.name ?? t.username ?? "",
            email: t.email ?? "",
          }))
        : [];
      setTeachers(normalized);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setTeachers([]);
      } else {
        console.error("Erro ao buscar professores:", error);
      }
    }
  };

  const handleAdd = async (teacherDTO: CreateTeacherDTO) => {
    await createTeacher(teacherDTO);
    await fetchTeachers();
    setIsModalOpen(false);
    toast.success("Professor cadastrado com sucesso!");
  };

  const handleEdit = async (id: string, teacherDTO: CreateTeacherDTO) => {
    await updateTeacher(id, teacherDTO);
    await fetchTeachers();
    setIsModalOpen(false);
    toast.success("Professor atualizado com sucesso!");
  };

  const handleDelete = (id: string) => {
    toast.custom((t) => (
      <div className="bg-[#1a1a1d] border border-orange-400/40 text-white p-4 rounded-xl shadow-md">
        <p className="font-semibold mb-2">Excluir professor?</p>
        <p className="text-sm text-gray-300 mb-4">
          Essa ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                await deleteTeacher(id);
                toast.dismiss(t);
                toast.success("Professor excluído com sucesso!");
                await fetchTeachers();
              } catch (error) {
                console.error("Erro ao excluir professor:", error);
                toast.error("Erro ao excluir professor.");
              }
            }}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm"
          >
            Excluir
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.nome.toLowerCase().includes(filterName.toLowerCase()),
  );

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
          Cadastro de Professores
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer"
            >
              + Cadastrar
            </button>
          </div>
        </div>

        <TeacherTable
          teachers={filteredTeachers}
          onDelete={handleDelete}
          onEdit={(teacher) => {
            setEditingTeacher(teacher);
            setIsModalOpen(true);
          }}
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
            {editingTeacher ? "Editar Professor" : "Novo Professor"}
          </h2>
          <TeacherForm
            onAdd={handleAdd}
            onEdit={handleEdit}
            editingTeacher={editingTeacher}
          />
        </Modal>
      </div>
    </div>
  );
}
