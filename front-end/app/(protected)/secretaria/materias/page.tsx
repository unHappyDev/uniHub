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
            id: s.subjectId ?? s.id,
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
  };

  const handleEdit = async (subject: Subject) => {
    if (!subject.id) return;
    await updateSubject(subject.id, subject);
    await fetchSubjects();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    console.log("handleDelete chamado com id:", id);

    if (!confirm("Tem certeza que deseja excluir esta matéria?")) return;

    try {
      console.log(" Enviando DELETE para:", `/subject/${id}`);

      const response = await deleteSubject(id);

      console.log("Resposta da API ao deletar:", response);

      await fetchSubjects();
    } catch (err: any) {
      console.error("Erro ao deletar matéria:", err);

      if (err.response) {
        console.error("Resposta do servidor:", err.response.data);
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
      }
    }
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
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
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
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer"
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
          <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
            {editingSubject ? "Editar Matéria" : "Nova Matéria"}
          </h2>
          <SubjectForm
            onAdd={handleAdd}
            onEdit={handleEdit}
            editingSubject={editingSubject}
            subjects={subjects} // ✅ passa a lista pra validar duplicados
          />
        </Modal>
      </div>
    </div>
  );
}
