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
import { getClassroomById } from "@/lib/api/classroom";

interface Student {
  id: string;
  nome: string;
}

export default function ClassroomGradesPage() {
  const params = useParams();
  const classroomId = params?.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editing, setEditing] = useState<(CreateGradeDTO & { id?: string }) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    try {
      const classroom = await getClassroomById(classroomId);
      if (!classroom) {
        toast.error("Turma não encontrada");
        return;
      }

      const studentsInClass = (classroom.students ?? []).map((s: any) => ({
        id: s.id,
        nome: s.name ?? s.nome ?? "Sem nome",
      }));

      const gradesFromServer = await getGradesByClassroom(classroomId);

      const mergedGrades = gradesFromServer.map((g: any) => ({
        ...g,
        student: studentsInClass.find((s) => s.id === g.studentId)?.nome || "Aluno desconhecido",
      }));

      setStudents(studentsInClass);
      setGrades(mergedGrades);
    } catch (err) {
      console.error("Erro no load:", err);
      toast.error("Erro ao carregar dados da turma");
    }
  }

  useEffect(() => {
    if (classroomId) load();
  }, [classroomId]);

  async function handleSave(data: CreateGradeDTO) {
    try {
      if (editing?.id) {
        const updateResp = await updateGrade(editing.id, data);

        const updatedFromServer = updateResp?.data ?? { ...data, id: editing.id };

        toast.success("Nota atualizada!");

        setGrades((prev) =>
          prev.map((g) =>
            g.id === editing.id
              ? {
                  ...g,
                  classroomId: updatedFromServer.classroomId ?? g.classroomId,
                  studentId: updatedFromServer.studentId ?? g.studentId,
                  activity: (updatedFromServer.activity as any) ?? g.activity,
                  grade: updatedFromServer.grade ?? g.grade,
                  student:
                    students.find(
                      (s) => s.id === (updatedFromServer.studentId ?? g.studentId)
                    )?.nome ?? g.student,
                }
              : g
          )
        );
      } else {
        const createResp = await createGrade(data);

        const returnedId = createResp?.data?.id ?? String(Date.now());

        const newGrade: Grade = {
          id: returnedId,
          classroomId: data.classroomId,
          studentId: data.studentId,
          activity: data.activity as any,
          grade: data.grade,
          student: students.find((s) => s.id === data.studentId)?.nome ?? "",
        };

        toast.success("Nota criada!");
        setGrades((prev) => [...prev, newGrade]);
      }

      setModalOpen(false);
      setEditing(null);
    } catch (err: any) {
      console.error("handleSave error:", err);
      const serverMessage =
        err?.response?.data?.message || err?.message || "Erro ao salvar nota";
      toast.error(serverMessage);
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
          setEditing({
            id: g.id,
            studentId: g.studentId,
            subject: g.subject || "",
            classroomId,
            activity: g.activity,
            grade: g.grade,
          });
          setModalOpen(true);
        }}
        onAdd={(data: CreateGradeDTO) => {
          setEditing({
            ...data,
            classroomId,
          });
          setModalOpen(true);
        }}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Editar / Adicionar Nota</h3>

          <GradeForm initialData={editing ?? undefined} onSubmit={handleSave} />
        </div>
      </Modal>
    </div>
  );
}
