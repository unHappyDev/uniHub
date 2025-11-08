"use client";

import { useEffect, useState } from "react";
import { getClassrooms, deleteClassroom } from "@/lib/api/classroom";
import { Classroom } from "@/types/Classroom";
import ClassroomTable from "@/components/cadastro/ClassroomTable";
import ClassroomForm from "@/components/cadastro/ClassroomForm";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [filterProfessor, setFilterProfessor] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const loadData = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(Array.isArray(data) ? data : []);
    } catch (error: any) {
       if (error.response?.status === 404) {
        setClassrooms([]);
      } else {
        console.error("Erro ao buscar turmas:", error);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
  toast.custom((t) => (
    <div className="bg-[#1a1a1d] border border-orange-400/40 text-white p-4 rounded-xl shadow-md">
      <p className="font-semibold mb-2">Excluir turma?</p>
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
              await deleteClassroom(id);
              toast.dismiss(t);
              toast.success("Turma excluída com sucesso!");
              await loadData();
            } catch (error) {
              console.error("Erro ao excluir turma:", error);
              toast.error("Erro ao excluir turma.");
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

  const handleEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setIsModalOpen(true);
  };

  const handleSaved = async () => {
    setIsModalOpen(false);
    setEditingClassroom(null);
    await loadData();
  };

  const filteredClassrooms = classrooms.filter((c) => {
    const professorName = c.professor?.toLowerCase() ?? "";
    const subjectName = c.subject?.toLowerCase() ?? "";
    return (
      professorName.includes(filterProfessor.toLowerCase()) &&
      subjectName.includes(filterSubject.toLowerCase())
    );
  });

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
          Gerenciar Turmas
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Filtrar por professor..."
              value={filterProfessor}
              onChange={(e) => setFilterProfessor(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <input
              type="text"
              placeholder="Filtrar por matéria..."
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer"
            >
              + Nova Turma
            </button>
          </div>
        </div>

        <ClassroomTable
          classrooms={filteredClassrooms}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
            {editingClassroom ? "Editar Turma" : "Nova Turma"}
          </h2>
          <ClassroomForm
            classroom={editingClassroom}
            onSaved={handleSaved}
            onClose={() => {
              setIsModalOpen(false);
              setEditingClassroom(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
