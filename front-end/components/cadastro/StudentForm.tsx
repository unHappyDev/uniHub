"use client";

import { useEffect, useState } from "react";
import { CreateStudentDTO, Student } from "@/types/Student";
import { getCourses } from "@/lib/api/course";

interface Course {
  id: string;
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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();
        console.log("Cursos recebidos do backend:", data);
        setCourses(data);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (editingStudent) {
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
      setFormData({
        nome: "",
        email: "",
        curso: "",
        courseId: "",
      });
    }
  }, [editingStudent, courses]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }) as Student);
    setErrorMessage(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
;

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

      setFormData({
        nome: "",
        email: "",
        curso: "",
        courseId: "",
      });
      setErrorMessage(null);
    } catch (error: any) {
      console.error("Erro ao enviar aluno:", error);

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
    <form onSubmit={handleSubmit} className="space-y-7 text-white">
      <div>
        <label className="block text-sm mb-1 uppercase">Nome</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-5 py-3 rounded-xl outline-none shadow-inner"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 uppercase">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-5 py-3 rounded-xl outline-none shadow-inner"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 uppercase">Curso</label>
        <select
          name="courseId"
          value={formData.courseId ?? ""}
          onChange={handleChange}
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-5 py-3 rounded-xl outline-none shadow-inner appearance-none"
        >
          <option value="">Selecione um curso</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id} className="bg-[#151a1b]">
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-6 py-3 rounded-xl  transition-all  uppercase cursor-pointer"
      >
        {editingStudent ? "Salvar Alterações" : "Cadastrar Aluno"}
      </button>

      {errorMessage && (
        <p className="text-red-500 text-center mt-2 font-semibold">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
