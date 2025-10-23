"use client";

import { useEffect, useState } from "react";
import { CreateTeacherDTO, Teacher } from "@/types/Teacher";

interface TeacherFormProps {
  onAdd: (teacher: CreateTeacherDTO) => Promise<void>;
  onEdit: (id: string, teacher: CreateTeacherDTO) => Promise<void>;
  editingTeacher: Teacher | null;
}

export default function TeacherForm({
  onAdd,
  onEdit,
  editingTeacher,
}: TeacherFormProps) {
  const [formData, setFormData] = useState<Teacher>({
    id: "",
    nome: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingTeacher) {
      setFormData(editingTeacher);
    } else {
      setFormData({ id: "", nome: "", email: "" });
    }
  }, [editingTeacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dto: CreateTeacherDTO = {
      registerUser: {
        name: formData.nome, // backend espera "name"
        email: formData.email,
        password: "12341234",
        role: "PROFESSOR",
      },
    };

    try {
      if (editingTeacher) {
        await onEdit(editingTeacher.id, dto);
      } else {
        await onAdd(dto);
      }

      setFormData({ id: "", nome: "", email: "" });
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMessage("Nome ou e-mail já existente!");
      } else {
        setErrorMessage("Erro ao cadastrar professor. Tente novamente.");
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

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-transparent border hover:border-orange-500 text-white font-semibold px-6 py-2 rounded-lg transition-all cursor-pointer"
      >
        {editingTeacher ? "Salvar Alterações" : "Cadastrar Professor"}
      </button>

      {errorMessage && (
        <p className="text-red-500 text-center mt-2 font-semibold">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
