"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateTeacherDTO, Teacher } from "@/types/Teacher";

interface TeacherFormProps {
  onAdd: (teacher: CreateTeacherDTO) => Promise<void>;
  onEdit: (id: string, teacher: CreateTeacherDTO) => Promise<void>;
  editingTeacher: Teacher | null;
}

export default function TeacherForm({ onAdd, onEdit, editingTeacher }: TeacherFormProps) {
  const [formData, setFormData] = useState<Teacher>({
    id: "",
    nome: "",
    email: "",
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dto: CreateTeacherDTO = {
      registerUser: {
        name: formData.nome,
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
        toast.error("Nome ou e-mail já existente!");
      } else {
        toast.error("Erro ao cadastrar professor. Tente novamente.");
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
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 transition-all text-white px-5 py-3 rounded-xl shadow-inner"
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
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 transition-all text-white px-5 py-3 rounded-xl shadow-inner"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-6 py-3 rounded-xl transition-all uppercase cursor-pointer"
      >
        {editingTeacher ? "Salvar Alterações" : "Cadastrar Professor"}
      </button>
    </form>
  );
}
