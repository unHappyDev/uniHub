"use client";

import { useEffect, useState } from "react";
import { Student, CreateStudentDTO } from "@/types/Student";
import StudentForm from "@/components/cadastro/StudentForm";
import StudentTable from "@/components/cadastro/StudentTable";
import { Modal } from "@/components/ui/modal";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/api/student";

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
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;
    await deleteStudent(id);
    fetchStudents();
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
    <div className="p-8 text-white flex flex-col min-h-screen ">
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
          onDelete={handleDelete}
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