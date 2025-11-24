"use client";

import { useEffect, useState } from "react";
import { Subject, CreateSubjectDTO } from "@/types/Subject";
import SubjectForm from "@/components/cadastro/SubjectForm";
import SubjectTable from "@/components/cadastro/SubjectTable";
import { Modal } from "@/components/ui/modal";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/lib/api/subject";
import { toast } from "sonner";

export default function MateriasPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [filterName, setFilterName] = useState("");

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      const normalized: Subject[] = Array.isArray(data)
        ? data.map((s: any) => ({
            subjectId: s.subjectId ?? s.id,
            subjectName: s.subjectName ?? s.name ?? "",
            workloadHours: s.workloadHours ?? s.cargaHoraria ?? 0,
          }))
        : [];
      setSubjects(normalized);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setSubjects([]);
      } else {
        console.error("Erro ao buscar matérias:", error);
      }
    }
  };

  const handleAdd = async (subject: CreateSubjectDTO) => {
    await createSubject(subject);
    await fetchSubjects();
    setIsModalOpen(false);
    toast.success("Matéria cadastrada com sucesso!");
  };

  const handleEdit = async (subject: Subject) => {
    if (!subject.subjectId) return;
    await updateSubject(subject.subjectId, subject);
    await fetchSubjects();
    setIsModalOpen(false);
    toast.success("Matéria atualizada com sucesso!");
  };

  const handleDelete = (id: string) => {
    toast.custom((t) => (
      <div className="bg-[#1a1a1d] border border-orange-400/40 text-white p-4 rounded-xl shadow-md">
        <p className="font-semibold mb-2">Excluir matéria?</p>
        <p className="text-sm text-gray-300 mb-4">
          Essa ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                await deleteSubject(id);
                toast.dismiss(t);
                toast.success("Matéria excluída com sucesso!");
                await fetchSubjects();
              } catch (error: any) {
                toast.dismiss(t);
                if (error.response?.status === 409) {
                  toast.error(
                    "Não é possível excluir esta matéria pois ela está vinculada a uma turma.",
                  );
                } else {
                  console.error("Erro ao excluir matéria:", error);
                  toast.error("Erro ao excluir matéria.");
                }
              }
            }}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    ));
  };

  const handleEditClick = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingSubject(null);
    setIsModalOpen(false);
  };

  const filteredSubjects = subjects.filter((s) =>
    s.subjectName.toLowerCase().includes(filterName.toLowerCase()),
  );

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center mb-10">
          Cadastro de Matérias
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-orange-500/70 hover:bg-orange-600/70 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer"
            >
              + Cadastrar
            </button>
          </div>
        </div>

        <SubjectTable
          subjects={filteredSubjects}
          onDelete={handleDelete}
          onEdit={handleEditClick}
        />

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold mb-4 text-center text-orange-300/80 uppercase">
            {editingSubject ? "Editar Matéria" : "Nova Matéria"}
          </h2>
          <SubjectForm
            onAdd={handleAdd}
            onEdit={handleEdit}
            editingSubject={editingSubject}
            subjects={subjects}
          />
        </Modal>
      </div>
    </div>
  );
}
