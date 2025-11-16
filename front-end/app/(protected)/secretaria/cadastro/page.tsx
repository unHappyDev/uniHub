"use client";

import { useEffect, useState } from "react";

import { Student, CreateStudentDTO } from "@/types/Student";
import StudentForm from "@/components/cadastro/StudentForm";
import StudentTable from "@/components/cadastro/StudentTable";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/api/student";

import { Teacher, CreateTeacherDTO } from "@/types/Teacher";
import TeacherForm from "@/components/cadastro/TeacherForm";
import TeacherTable from "@/components/cadastro/TeacherTable";
import {
  getTeachers,
  createTeacher as apiCreateTeacher,
  updateTeacher as apiUpdateTeacher,
  deleteTeacher as apiDeleteTeacher,
} from "@/lib/api/teacher";

import { Admin, CreateAdminDTO } from "@/types/Admin";
import AdminForm from "@/components/cadastro/AdminForm";
import AdminTable from "@/components/cadastro/AdminTable";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/lib/api/admin";

import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DEFAULT_PASSWORD = "12341234";

export default function CadastroUnificado() {
  const [selectedType, setSelectedType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [filterStudentName, setFilterStudentName] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [filterTeacherName, setFilterTeacherName] = useState("");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [filterAdminName, setFilterAdminName] = useState("");

  useEffect(() => {
    if (selectedType === "student") fetchStudents();
    if (selectedType === "teacher") fetchTeachers();
    if (selectedType === "admin") fetchAdmins();
  }, [selectedType]);

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
    } catch {
      setStudents([]);
    }
  };

  const handleAddStudent = async (student: Student | CreateStudentDTO) => {
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
    closeModal();
    toast.success("Aluno cadastrado!");
  };

  const handleUpdateStudent = async (student: Student) => {
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
    closeModal();
    toast.success("Aluno atualizado!");
  };

  const deleteStudentConfirm = (id: string) => {
    toast.custom((t) => (
      <DeleteConfirmCard
        title="Excluir aluno?"
        onDelete={async () => {
          await deleteStudent(id);
          toast.dismiss(t);
          toast.success("Aluno excluído!");
          fetchStudents();
        }}
        onCancel={() => toast.dismiss(t)}
      />
    ));
  };

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      const normalized = Array.isArray(data)
        ? data.map((t: any, i: number) => ({
            id: t.id?.toString() ?? String(i + 1),
            nome: t.nome ?? t.name ?? t.username ?? "",
            email: t.email ?? "",
          }))
        : [];
      setTeachers(normalized);
    } catch {
      setTeachers([]);
    }
  };

  const handleAddTeacher = async (teacherDTO: CreateTeacherDTO) => {
    await apiCreateTeacher(teacherDTO);
    await fetchTeachers();
    closeModal();
    toast.success("Professor cadastrado!");
  };

  const handleUpdateTeacher = async (
    id: string,
    teacherDTO: CreateTeacherDTO,
  ) => {
    await apiUpdateTeacher(id, teacherDTO);
    await fetchTeachers();
    closeModal();
    toast.success("Professor atualizado!");
  };

  const deleteTeacherConfirm = (id: string) => {
    toast.custom((t) => (
      <DeleteConfirmCard
        title="Excluir professor?"
        onDelete={async () => {
          await apiDeleteTeacher(id);
          toast.dismiss(t);
          toast.success("Professor excluído!");
          fetchTeachers();
        }}
        onCancel={() => toast.dismiss(t)}
      />
    ));
  };

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();

      const normalized: Admin[] = Array.isArray(data)
        ? data
            .filter(
              (a: any) => (a.role ?? a.userRole ?? "").toString() === "ADMIN",
            )
            .map((a: any, index: number) => ({
              id: a.id ?? String(index + 1),
              nome: (a.name ?? a.username ?? a.nome ?? "").toString(),
              email: (a.email ?? "").toString(),
              role: (a.role ?? "ADMIN").toString(),
            }))
        : [];

      setAdmins(normalized);
    } catch (err) {
      console.error("Erro ao buscar admins:", err);
      setAdmins([]);
    }
  };
  const handleAddAdmin = async (adminDTO: CreateAdminDTO) => {
    await createAdmin(adminDTO);
    await fetchAdmins();
    closeModal();
    toast.success("Admin cadastrado!");
  };
  const handleUpdateAdmin = async (id: string, dto: CreateAdminDTO) => {
    await updateAdmin(id, dto);
    await fetchAdmins();
    closeModal();
    toast.success("Admin atualizado!");
  };

  const deleteAdminConfirm = (id: string) => {
    toast.custom((t) => (
      <DeleteConfirmCard
        title="Excluir admin?"
        onDelete={async () => {
          try {
            await deleteAdmin(id);
            toast.dismiss(t);
            toast.success("Admin excluído!");
            fetchAdmins();
          } catch (error: any) {
            toast.dismiss(t);

            if (error?.response?.status === 409) {
              toast.error("Você não pode excluir sua própria conta!");
            } else {
              toast.error("Erro ao excluir admin.");
              console.error(error);
            }
          }
        }}
        onCancel={() => toast.dismiss(t)}
      />
    ));
  };

  const openModal = () => {
    setEditingStudent(null);
    setEditingTeacher(null);
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setEditingTeacher(null);
    setEditingAdmin(null);
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter((s) => {
    const matchesName = s.nome
      ?.toLowerCase()
      .includes(filterStudentName.toLowerCase());

    const courseName =
      typeof s.curso === "string" ? s.curso : s.curso?.courseName || "";

    const matchesCourse = courseName
      .toLowerCase()
      .includes(filterCourse.toLowerCase());

    return matchesName && matchesCourse;
  });

  const filteredTeachers = teachers.filter((t) =>
    t.nome.toLowerCase().includes(filterTeacherName.toLowerCase()),
  );

  const filteredAdmins = admins.filter((a) =>
    a.nome.toLowerCase().includes(filterAdminName.toLowerCase()),
  );

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-medium mb-8 text-center uppercase">
        Gerenciamento de Cadastros
      </h1>
      <div className="flex flex-col gap-5 bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow">
        <div className="flex gap-4">
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className=" bg-[#1a1a1dc3] border border-orange-400/20 text-white cursor-pointer rounded-xl px-10 py-3">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>

            <SelectContent className="bg-[#151a1b] text-white border border-orange-400/20">
              <SelectItem
                value="student"
                className="hover:bg-orange-500/10 focus:bg-orange-500/20 text-white cursor-pointer"
              >
                Alunos
              </SelectItem>

              <SelectItem
                value="teacher"
                className="hover:bg-orange-500/10 focus:bg-orange-500/20 text-white cursor-pointer"
              >
                Professores
              </SelectItem>

              <SelectItem
                value="admin"
                className="hover:bg-orange-500/10 focus:bg-orange-500/20 text-white cursor-pointer"
              >
                Admins
              </SelectItem>
            </SelectContent>
          </Select>

          {selectedType !== "" && (
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-6 py-2 rounded-xl shadow-md uppercase cursor-pointer"
            >
              + Cadastrar
            </button>
          )}
        </div>

        {selectedType === "student" && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterStudentName}
              onChange={(e) => setFilterStudentName(e.target.value)}
              className="w-full  bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <input
              type="text"
              placeholder="Filtrar por curso..."
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
          </div>
        )}

        {selectedType === "teacher" && (
          <div>
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterTeacherName}
              onChange={(e) => setFilterTeacherName(e.target.value)}
              className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
          </div>
        )}

        {selectedType === "admin" && (
          <div>
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filterAdminName}
              onChange={(e) => setFilterAdminName(e.target.value)}
              className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
          </div>
        )}
      </div>

      {selectedType === "student" && (
        <StudentTable
          students={filteredStudents}
          onDelete={deleteStudentConfirm}
          onEdit={(st) => {
            setEditingStudent(st);
            setIsModalOpen(true);
          }}
        />
      )}

      {selectedType === "teacher" && (
        <TeacherTable
          teachers={filteredTeachers}
          onDelete={deleteTeacherConfirm}
          onEdit={(t) => {
            setEditingTeacher(t);
            setIsModalOpen(true);
          }}
        />
      )}

      {selectedType === "admin" && (
        <AdminTable
          admins={filteredAdmins}
          onDelete={deleteAdminConfirm}
          onEdit={(a: Admin) => {
            setEditingAdmin(a);
            setIsModalOpen(true);
          }}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedType === "student" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-orange-300">
              {editingStudent ? "Editar Aluno" : "Novo Aluno"}
            </h2>
            <StudentForm
              onAdd={handleAddStudent}
              onEdit={handleUpdateStudent}
              editingStudent={editingStudent}
              students={students}
            />
          </>
        )}

        {selectedType === "teacher" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-orange-300">
              {editingTeacher ? "Editar Professor" : "Novo Professor"}
            </h2>
            <TeacherForm
              onAdd={handleAddTeacher}
              onEdit={handleUpdateTeacher}
              editingTeacher={editingTeacher}
            />
          </>
        )}

        {selectedType === "admin" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-orange-300">
              {editingAdmin ? "Editar Admin" : "Novo Admin"}
            </h2>
            <AdminForm
              onAdd={handleAddAdmin}
              onEdit={handleUpdateAdmin}
              editingAdmin={editingAdmin}
            />
          </>
        )}
      </Modal>
    </div>
  );
}

function DeleteConfirmCard({ title, onDelete, onCancel }: any) {
  return (
    <div className="bg-[#1a1a1d] border border-orange-400/40 text-white p-4 rounded-xl shadow-md">
      <p className="font-semibold mb-2">{title}</p>
      <p className="text-sm text-gray-300 mb-4">
        Essa ação não pode ser desfeita.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
