"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

import { getStudents } from "@/lib/api/student";
import { getGradesByClassroom, createGrade, updateGrade } from "@/lib/api/grade";

import GradeForm from "@/components/cadastro/GradeForm";
import GradeTable from "@/components/cadastro/GradeTable";
import { Grade, CreateGradeDTO } from "@/types/Grade";

interface Student {
  id: string;
  nome: string;
}

export default function ClassroomGradesPage() {
  const params = useParams();
  const classroomId = params?.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editing, setEditing] = useState<Partial<Grade> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    try {
      // buscar todos os alunos e filtrar apenas os que pertencem à turma
      const allStudents = await getStudents();
      const studentsInClass = allStudents.filter((s: any) =>
        s.classroomIds?.includes(classroomId)
      );

      const gr = await getGradesByClassroom(classroomId);

      setStudents(studentsInClass || []);
      setGrades(gr || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados da turma");
    }
  }

  useEffect(() => {
    if (!classroomId) return;
    load();
  }, [classroomId]);

  async function handleSave(data: CreateGradeDTO) {
    try {
      if (editing?.id) {
        await updateGrade(editing.id, data);
        toast.success("Nota atualizada!");
      } else {
        await createGrade(data);
        toast.success("Nota criada!");
      }

      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar nota");
    }
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Notas da Turma</h1>

      <GradeTable
        students={students}
        grades={grades}
        classroomId={classroomId}
        onEdit={(g: Grade) => {
          setEditing(g);
          setModalOpen(true);
        }}
        onAdd={(obj: Partial<Grade>) => {
          setEditing(obj);
          setModalOpen(true);
        }}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Editar / Adicionar Nota</h3>
          <GradeForm
            initialData={
              editing
                ? {
                    studentId: editing.studentId || "",
                    classroomId,
                    activity: editing.activity || "",
                    grade: editing.grade ?? 0,
                  }
                : undefined
            }
            onSubmit={handleSave}
          />
        </div>
      </Modal>
    </div>
  );
}
