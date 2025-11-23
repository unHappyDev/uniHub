"use client";

import { useState, useEffect } from "react";
import { Admin, CreateAdminDTO } from "@/types/Admin";
import { User, Mail, Shield } from "lucide-react";

interface AdminFormProps {
  editingAdmin: Admin | null;
  onAdd: (dto: CreateAdminDTO) => void;
  onEdit: (id: string, dto: CreateAdminDTO) => void;
}

export default function AdminForm({
  editingAdmin,
  onAdd,
  onEdit,
}: AdminFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
  });

  useEffect(() => {
    if (editingAdmin) {
      setFormData({
        nome: editingAdmin.nome,
        email: editingAdmin.email,
      });
    } else {
      setFormData({ nome: "", email: "" });
    }
  }, [editingAdmin]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const dto: CreateAdminDTO = {
      name: formData.nome,
      email: formData.email,
      password: "12341234",
      role: "ADMIN",
    };

    if (editingAdmin) onEdit(editingAdmin.id, dto);
    else onAdd(dto);
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

      <div className="space-y-2">
        <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
          Função
        </label>

        <div className="relative">
          <Shield
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50"
            size={18}
          />
          <input
            type="text"
            value="ADMIN"
            disabled
            className="w-full bg-[#1a1a1dc3] border border-orange-400/40 
                       text-white px-10 py-3 rounded-xl opacity-60 cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500/70 hover:bg-orange-600/70 
                   text-white font-semibold px-6 py-3 rounded-xl 
                   transition-all uppercase cursor-pointer"
      >
        {editingAdmin ? "Salvar Alterações" : "Cadastrar Admin"}
      </button>
    </form>
  );
}
