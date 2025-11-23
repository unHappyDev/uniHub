"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateTeacherDTO, Teacher } from "@/types/Teacher";
import { Mail, User } from "lucide-react";

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
      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Nome
        </label>

        <div className="relative">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
            size={18}
          />
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                     text-white px-10 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Email
        </label>

        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
            size={18}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                     text-white px-10 py-3 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500/70 hover:bg-orange-600/70 text-white font-semibold px-6 py-3 rounded-xl transition-all uppercase cursor-pointer"
      >
        {editingTeacher ? "Salvar Alterações" : "Cadastrar Professor"}
      </button>
    </form>
  );
}
