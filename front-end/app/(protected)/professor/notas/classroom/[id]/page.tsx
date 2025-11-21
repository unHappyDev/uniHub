"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { getGradesByClassroom, createGrade, updateGrade } from "@/lib/api/grade";
import { getClassroomById } from "@/lib/api/classroom";
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

  const [classroom, setClassroom] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editing, setEditing] = useState<CreateGradeDTO & { id?: string; student?: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    console.log("🔄 Carregando dados...");

    try {
      const classroomResp = await getClassroomById(classroomId);
      console.log("📌 Classroom recebido:", classroomResp);

      if (!classroomResp) {
        toast.error("Turma não encontrada");
        return;
      }
      setClassroom(classroomResp);

      const studentsInClass = (classroomResp.students ?? []).map((s: any) => ({
        id: s.id,
        nome: s.name ?? s.nome ?? "Sem nome",
      }));

      console.log("👥 Alunos da turma:", studentsInClass);
      setStudents(studentsInClass);

      const gradesFromServer = await getGradesByClassroom(classroomId);
      console.log("📚 Notas recebidas do servidor:", gradesFromServer);

      const mergedGrades = gradesFromServer.map((g: any) => {
        const studentObj = studentsInClass.find((s) => s.id === g.studentId);
        return {
          ...g,
          studentId: g.studentId,
          student: studentObj?.nome || "Aluno desconhecido"
        };
      });

      console.log("📌 Notas após merge:", mergedGrades);

      setGrades(mergedGrades);

    } catch (err) {
      console.error("❌ Erro no load:", err);
      toast.error("Erro ao carregar dados da turma");
    }
  }

  useEffect(() => {
    if (classroomId) load();
  }, [classroomId]);

  async function handleSave(data: CreateGradeDTO) {
    console.log("💾 Salvando dados:", data);

    try {
      const studentObj = students.find((s) => s.id === data.studentId);
      if (!studentObj) throw new Error("Aluno não encontrado!");

      if (editing?.id) {
        console.log("✏️ Atualizando nota ID:", editing.id);

        const updateResp = await updateGrade(editing.id, data);
        console.log("🔁 Retorno update:", updateResp);

        const updated = {
          id: editing.id,
          ...data,
          student: studentObj.nome
        };

        setGrades((prev) =>
          prev.map((g) => (g.id === editing.id ? updated : g))
        );

        toast.success("Nota atualizada!");
      } else {
        console.log("🆕 Criando nota...");

        const createResp = await createGrade(data);
        console.log("📨 Retorno criação:", createResp);

        const returnedId = createResp?.data?.id ?? String(Date.now());

        const newGrade: Grade = {
          id: returnedId,
          ...data,
          student: studentObj.nome
        };

        setGrades((prev) => [...prev, newGrade]);

        toast.success("Nota adicionada!");
      }

      setModalOpen(false);
      setEditing(null);
    } catch (err: any) {
      console.error("❌ Erro no handleSave:", err);
      toast.error(err?.response?.data?.message || err?.message || "Erro ao salvar a nota");
    }
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Notas da Turma</h1>

      {classroom && (
        <GradeTable
          students={students}
          grades={grades}
          classroomId={classroomId}
          onEdit={(g: Grade) => {
            console.log("📝 Editando:", g);

            setEditing({
              id: g.id,
              studentId: g.studentId,
              student: g.student,
              classroomId,
              subject: classroom.subject,
              activity: g.activity,
              grade: g.grade,
            });

            setModalOpen(true);
          }}
          onAdd={(student) => {
            console.log("➕ Adicionando nota para aluno:", student);

            setEditing({
              studentId: student.id,
              student: student.nome,
              classroomId,
              subject: classroom.subject,
              activity: "prova",
              grade: 0,
            });

            setModalOpen(true);
          }}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">
            {editing?.id ? "Editar Nota" : "Adicionar Nota"}
          </h3>

          {classroom && (
            <GradeForm
              key={editing?.id ?? "new"}
              initialData={editing ?? undefined}
              onSubmit={handleSave}
              classroom={classroom}
              students={students}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
