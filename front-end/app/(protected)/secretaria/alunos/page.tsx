"use client";

import { useEffect, useState } from "react";
import { Student, CreateStudentDTO } from "@/types/Student";
import StudentForm from "@/components/cadastro/StudentForm";
import StudentTable from "@/components/cadastro/StudentTable";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { createStudent, getStudents, updateStudent, deleteStudent } from "@/lib/api/student";

const DEFAULT_PASSWORD = "12341234";

export default function AlunosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [filterName, setFilterName] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      const normalized = Array.isArray(data)
        ? data.map((s: any, index: number) => ({
            id: s.id ?? String(index + 1),
            nome: s.username ?? "",
            email: s.email ?? "",
            curso: s.courseName ?? "",
            courseId: s.courseId ?? null,
          }))
        : [];
      setStudents(normalized);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setStudents([]);
      } else {
        console.error("Erro ao buscar alunos:", error);
      }
    }
  };

  const handleAdd = async (student: Student | CreateStudentDTO) => {
    const dto: CreateStudentDTO =
      "registerUser" in student
        ? student
        : {
            userId: null,
            courseId: student.courseId,
            registerUser: {
              name: student.nome,
              email: student.email,
              password: DEFAULT_PASSWORD,
            },
          };

    await createStudent(dto);
    await fetchStudents();
    setIsModalOpen(false);
    toast.success("Aluno cadastrado com sucesso!");
  };

  const handleUpdate = async (student: Student) => {
    if (!student.id) return;
    const dto: CreateStudentDTO = {
      userId: student.id,
      courseId: student.courseId!,
      registerUser: {
        name: student.nome,
        email: student.email,
        password: DEFAULT_PASSWORD,
      },
    };
    await updateStudent(student.id, dto);
    await fetchStudents();
    setIsModalOpen(false);
    toast.success("Aluno atualizado com sucesso!");
  };

  const confirmDeleteStudent = (id: string) => {
    toast.custom((t) => (
      <div className="bg-[#1a1a1d] border border-orange-400/40 text-white p-4 rounded-xl shadow-md">
        <p className="font-semibold mb-2">Excluir aluno?</p>
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
                await deleteStudent(id);
                toast.dismiss(t);
                toast.success("Aluno excluído com sucesso!");
                await fetchStudents();
              } catch (error) {
                console.error("Erro ao excluir aluno:", error);
                toast.error("Erro ao excluir aluno.");
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

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter((s) => {
    const matchesName = s.nome?.toLowerCase().includes(filterName.toLowerCase());
    const courseName =
      typeof s.curso === "string" ? s.curso : s.curso?.courseName || "";
    const matchesCourse = courseName
      .toLowerCase()
      .includes(filterCourse.toLowerCase());
    return matchesName && matchesCourse;
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
          Cadastro de Alunos
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder=" Filtrar por nome..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <input
              type="text"
              placeholder=" Filtrar por curso..."
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
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

        <StudentTable
          students={filteredStudents}
          onDelete={confirmDeleteStudent}
          onEdit={handleEdit}
        />

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
            {editingStudent ? "Editar Aluno" : "Novo Aluno"}
          </h2>
          <StudentForm
            onAdd={handleAdd}
            onEdit={handleUpdate}
            editingStudent={editingStudent}
            students={students}
          />
        </Modal>
      </div>
    </div>
  );
}
