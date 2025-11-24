"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import {
  getGradesByClassroom,
  createGrade,
  updateGrade,
} from "@/lib/api/grade";
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
  const router = useRouter();
  const classroomId = params?.id as string;

  const [classroom, setClassroom] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStudent, setFilterStudent] = useState("");

  async function load() {
    try {
      const classroomResp = await getClassroomById(classroomId);
      if (!classroomResp) {
        toast.error("Turma não encontrada");
        return;
      }
      setClassroom(classroomResp);

      const studentsInClass = (classroomResp.students ?? []).map((s: any) => ({
        id: s.id,
        nome: s.name ?? s.nome ?? "Sem nome",
      }));
      setStudents(studentsInClass);

      const gradesFromServer = await getGradesByClassroom(classroomId);
      const mergedGrades = gradesFromServer.map((g: any) => {
        const studentObj = studentsInClass.find((s) => s.id === g.studentId);
        return {
          ...g,
          classroomId,
          studentId: g.studentId,
          activity: g.activity.toLowerCase(),
          student: studentObj?.nome || "Aluno desconhecido",
          bimester: g.bimester ?? 1,
        };
      });

      setGrades(mergedGrades);
    } catch (err) {
      console.error("Erro no load:", err);
      toast.error("Erro ao carregar dados da turma");
    }
  }

  useEffect(() => {
    if (classroomId) load();
  }, [classroomId]);

  const filteredStudents = students.filter((s) =>
    s.nome.toLowerCase().includes(filterStudent.toLowerCase())
  );

  async function handleSave(data: CreateGradeDTO) {
    try {
      const studentObj = students.find((s) => s.id === data.studentId);
      if (!studentObj) throw new Error("Aluno não encontrado!");

      const existingGrade = grades.find(
        (g) =>
          g.studentId === data.studentId &&
          g.activity === data.activity &&
          g.bimester === data.bimester
      );

      if (existingGrade) {
        await updateGrade(existingGrade.id!, data);
        toast.success("Nota atualizada!");
      } else {
        await createGrade(data);
        toast.success("Nota adicionada!");
      }

      await load();
      setModalOpen(false);
      setEditingStudent(null);
    } catch (err: any) {
      console.error("Erro no handleSave:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Erro ao salvar a nota"
      );
    }
  }

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
     
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.back()}
          className="hidden md:block px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white font-semibold w-max transition-colors cursor-pointer"
        >
          Voltar
        </button>

        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center flex-1 ml-6">
          Notas da Turma {classroom?.subject ?? ""}
        </h1>
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <input
          type="text"
          placeholder="Filtrar por aluno..."
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
        />
      </div>

      <GradeTable
        students={filteredStudents}
        grades={grades}
        classroomId={classroomId}
        onEdit={(student: Student) => {
          setEditingStudent(student);
          setModalOpen(true);
        }}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-center text-orange-300/80 uppercase">
            {editingStudent ? "Editar Nota" : "Adicionar Nota"}
          </h2>

          {classroom && editingStudent && (
            <GradeForm
              key={editingStudent.id}
              initialData={{
                studentId: editingStudent.id,
                classroomId: classroom.classroomId,
                subject: classroom.subject,
                activity: "prova",
                grade: 0,
                bimester: 1,
              }}
              onSubmit={handleSave}
              classroom={classroom}
              students={students}
              grades={grades}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}