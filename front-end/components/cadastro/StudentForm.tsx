"use client";

import { useEffect, useState } from "react";
import { CreateStudentDTO, Student } from "@/types/Student";
import { getCourses } from "@/lib/api/course";

interface Course {
  id: string; // UUID
  courseName: string;
}

interface StudentFormProps {
  onAdd: (student: Student | CreateStudentDTO) => Promise<void>;
  onEdit: (student: Student) => Promise<void>;
  editingStudent: Student | null;
  students: Student[];
}

export default function StudentForm({
  onAdd,
  onEdit,
  editingStudent,
}: StudentFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<Student>({
    nome: "",
    email: "",
    curso: "",
    courseId: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 🆕 estado para mensagem de erro

  // 🔹 Carrega cursos ao iniciar
  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();
        console.log("📘 Cursos recebidos do backend:", data);
        setCourses(data);
      } catch (err) {
        console.error("❌ Erro ao buscar cursos:", err);
      }
    }
    fetchCourses();
  }, []);

  // 🔹 Preenche ou limpa o form ao editar
  useEffect(() => {
    if (editingStudent) {
      console.log("✏️ Editando aluno:", editingStudent);

      const matchedCourse = courses.find(
        (c) =>
          c.courseName.toLowerCase().trim() ===
          (typeof editingStudent.curso === "string"
            ? editingStudent.curso.toLowerCase().trim()
            : editingStudent.curso?.courseName.toLowerCase().trim()),
      );

      setFormData({
        nome: editingStudent.nome,
        email: editingStudent.email,
        curso: editingStudent.curso,
        courseId: matchedCourse
          ? matchedCourse.id
          : editingStudent.courseId || "",
      });
    } else {
      console.log("🆕 Novo aluno - limpando form");
      setFormData({
        nome: "",
        email: "",
        curso: "",
        courseId: "",
      });
    }
  }, [editingStudent, courses]);

  // 🔹 Atualiza estado do form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }) as Student);
    setErrorMessage(null); // 🆕 limpa erro quando usuário digita
  };

  // 🔹 Submete o form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Submetendo formData:", formData);

    if (!formData.courseId) {
      alert("Selecione um curso antes de cadastrar!");
      return;
    }

    const studentDTO: CreateStudentDTO = {
      userId: null,
      courseId: formData.courseId,
      registerUser: {
        name: formData.nome,
        email: formData.email,
        password: "12341234",
      },
    };

    console.log(
      "📤 Enviando aluno ao backend:",
      JSON.stringify(studentDTO, null, 2),
    );

    try {
      if (editingStudent) {
        const updatedStudent: Student = {
          ...editingStudent,
          nome: formData.nome,
          email: formData.email,
          curso: formData.curso,
          courseId: formData.courseId,
        };
        await onEdit(updatedStudent);
      } else {
        await onAdd(studentDTO as any);
      }

      console.log("✅ Cadastro concluído!");
      setFormData({
        nome: "",
        email: "",
        curso: "",
        courseId: "",
      });
      setErrorMessage(null); // 🆕 limpa erro depois de sucesso
    } catch (error: any) {
      console.error("❌ Erro ao enviar aluno:", error);

      if (error.response) {
        const status = error.response.status;

        if (status === 409) {
          setErrorMessage("Nome ou e-mail já existente!");
        } else if (status === 401) {
          setErrorMessage("Nome ou e-mail já existente!");
        } else if (status === 400) {
          setErrorMessage(
            "Dados inválidos. Verifique os campos e tente novamente.",
          );
        } else {
          setErrorMessage("Erro ao cadastrar aluno. Tente novamente.");
        }
      } else {
        setErrorMessage("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <label className="block text-sm mb-1">Nome</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Curso</label>
        <select
          name="courseId"
          value={formData.courseId ?? ""}
          onChange={handleChange}
          required
          className="w-full bg-neutral-900 border border-orange-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/40"
        >
          <option value="">Selecione um curso</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-transparent border hover:border-orange-500 text-white font-semibold px-6 py-2 rounded-lg transition-all cursor-pointer"
      >
        {editingStudent ? "Salvar Alterações" : "Cadastrar Aluno"}
      </button>

      {/* 🆕 Exibe mensagem de erro abaixo do botão */}
      {errorMessage && (
        <p className="text-red-500 text-center mt-2 font-semibold">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
