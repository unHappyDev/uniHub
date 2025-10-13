"use client";
import React, { useEffect, useState } from "react";
import { Student } from "@/types/Student";

interface StudentFormProps {
  onAdd: (student: Student) => Promise<void> | void;
  onEdit: (student: Student) => Promise<void> | void;
  editingStudent: Student | null;
  students: Student[];
}

export default function StudentForm({
  onAdd,
  onEdit,
  editingStudent,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Omit<Student, "id">>({
    nome: "",
    email: "",
    curso: "",
    semestre: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      const { id, ...data } = editingStudent;
      setFormData(data);
      setError("");
    } else {
      setFormData({ nome: "", email: "", curso: "", semestre: "" });
    }
  }, [editingStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.curso || !formData.semestre) {
      setError("Por favor, preencha todos os campos antes de salvar.");
      return;
    }

    setLoading(true);
    try {
      if (editingStudent) {
        await onEdit({ ...editingStudent, ...formData });
      } else {
        await onAdd(formData as Student);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar aluno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-lg"
    >
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        className="w-full border border-transparent bg-neutral-950 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-transparent bg-neutral-950 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
      />

      <input
        type="text"
        name="curso"
        placeholder="Curso"
        value={formData.curso}
        onChange={handleChange}
        className="w-full border border-transparent bg-neutral-950 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
      />

      <input
        type="text"
        name="semestre"
        placeholder="Semestre"
        value={formData.semestre}
        onChange={handleChange}
        className="w-full border border-transparent bg-neutral-950 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none"
      />

      {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer"
        >
          {loading
            ? "Salvando..."
            : editingStudent
            ? "Salvar Alterações"
            : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
