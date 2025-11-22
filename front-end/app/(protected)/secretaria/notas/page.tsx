"use client";

import { useEffect, useState } from "react";
import { Grade, CreateGradeDTO } from "@/types/Grade";
import GradeForm from "@/components/cadastro/GradeForm";
import GradeTable from "@/components/cadastro/GradeTable";

import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { createGrade, deleteGrade, getGrades, updateGrade } from "@/lib/api/grade";

export default function GradePage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Grade | null>(null);

  async function load() {
    try {
      const data = await getGrades();
      setGrades(data);
    } catch (error: any) {
      if (error.response?.status === 404) setGrades([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: CreateGradeDTO) {
    try {
      await createGrade(data);
      toast.success("Nota criada");
      setModalOpen(false);
      load();
    } catch {
      toast.error("Erro ao criar");
    }
  }

  async function handleEdit(data: CreateGradeDTO) {
    if (!editing) return;

    try {
      await updateGrade(editing.id, data);
      toast.success("Nota atualizada");
      setEditing(null);
      setModalOpen(false);
      load();
    } catch {
      toast.error("Erro ao atualizar");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGrade(id);
      toast.success("Nota excluída");
      load();
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <h1 className="text-3xl font-medium mb-8 text-center uppercase">
        Notas
      </h1>

      <div className="flex justify-end mb-6">
        <button
          className="bg-gradient-to-r from-orange-500/50 to-yellow-400/30
                     hover:from-orange-500/60 hover:to-yellow-400/40
                     text-white font-medium px-6 py-2.5 rounded-xl
                     shadow-md transition-all uppercase"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Cadastrar Nota
        </button>
      </div>

      <GradeTable
        grades={grades}
        onEdit={(g) => {
          setEditing(g);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4 text-center uppercase text-white">
          {editing ? "Editar Nota" : "Criar Nota"}
        </h2>

        <GradeForm
          initialData={
            editing
              ? {
                  studentId: editing.studentId,
                  classroomId: "",
                  activity: "",
                  grade: editing.grade
                }
              : undefined
          }
          onSubmit={editing ? handleEdit : handleCreate}
        />
      </Modal>
    </div>
  );
}
