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

  //  Buscar alunos
  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      console.log("📋 Alunos carregados:", data);

      //  Normaliza os dados vindos do backend
      const normalized = Array.isArray(data)
        ? data.map((s: any, index: number) => ({
            id: s.id ?? String(index + 1),
            nome: s.username ?? "",
            email: s.email ?? "",
            curso: s.courseName ?? "",
            courseId: s.courseId ?? null,
          }))
        : [];

      console.log("📋 Alunos normalizados:", normalized);
      setStudents(normalized);
    } catch (error: any) {
      console.error("Erro ao buscar alunos:", error);
      if (error.response?.status === 404) {
        setStudents([]);
        console.warn("Nenhum aluno encontrado no banco de dados.");
      } else {
        alert("Erro ao buscar alunos. Verifique o backend.");
      }
    }
  };

  //  Adicionar aluno
  const handleAdd = async (student: Student | CreateStudentDTO) => {
    let dto: CreateStudentDTO;

    if ("registerUser" in student) {
      dto = student;
    } else {
      dto = {
        userId: null,
        courseId: student.courseId,
        registerUser: {
          name: student.nome,
          email: student.email,
          password: DEFAULT_PASSWORD,
        },
      };
    }

    await createStudent(dto);
    await fetchStudents();
    setIsModalOpen(false);
  };

  //  Atualizar aluno
  const handleUpdate = async (student: Student) => {
    if (!student.id) {
      console.error("❌ Erro: aluno sem ID para atualização:", student);
      alert("Erro interno: o ID do aluno não foi encontrado.");
      return;
    }

    const dto: CreateStudentDTO = {
      userId: student.id,
      courseId: student.courseId!,
      registerUser: {
        name: student.nome,
        email: student.email,
        password: DEFAULT_PASSWORD,
      },
    };

    console.log("📤 Atualizando aluno:", student.id, dto);

    await updateStudent(student.id, dto);
    await fetchStudents();
    setIsModalOpen(false);
  };

  //  Excluir aluno
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;
    await deleteStudent(id);
    fetchStudents();
  };

  //  Editar aluno
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  //  Fechar modal
  const closeModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  //  Filtros
  const filteredStudents = students.filter((s) => {
    const matchesName = s.nome
      ?.toLowerCase()
      .includes(filterName.toLowerCase());

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
    <div className="p-8 text-white flex flex-col">
      <h1 className="text-2xl font-medium mb-7 text-center uppercase">
        Cadastro de Alunos
      </h1>

      {/* Filtros */}
      <div className="bg-neutral-800/60 backdrop-blur-sm border border-orange-400 rounded-xl p-4 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full sm:flex-1 border border-transparent bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
          />
          <input
            type="text"
            placeholder="Filtrar por curso..."
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full sm:flex-1 border border-transparent bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-orange-500 hover:bg-transparent hover:border-1 hover:border-orange-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all cursor-pointer"
          >
            + Cadastrar
          </button>
        </div>
      </div>

     {/* tabela  */}
      <StudentTable
        students={filteredStudents}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4 text-center">
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
  );
}
