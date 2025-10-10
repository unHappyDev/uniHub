"use client";
import React, { useEffect, useState } from "react";
import { Student } from "@/types/Student";

interface Props {
  onAdd: (student: Student) => void;
  onEdit: (student: Student) => void;
  editingStudent: Student | null;
  students: Student[];
}

export function StudentForm({
  onAdd,
  onEdit,
  editingStudent,
  students,
}: Props) {
  const [formData, setFormData] = useState<Omit<Student, "id">>({
    nome: "",
    email: "",
    curso: "",
    semestre: "",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (editingStudent) {
      const { id, ...data } = editingStudent;
      setFormData(data);
      setError("");
    }
  }, [editingStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.email ||
      !formData.curso ||
      !formData.semestre
    ) {
      setError("Por favor, preencha todos os campos antes de cadastrar.");
      return;
    }

    const emailDuplicado = students.some(
      (student) =>
        student.email.toLowerCase() === formData.email.toLowerCase() &&
        student.id !== editingStudent?.id,
    );

    if (emailDuplicado) {
      setError("Já existe um aluno cadastrado com esse e-mail!");
      return;
    }

    if (editingStudent) {
      onEdit({ ...formData, id: editingStudent.id });
    } else {
      onAdd({ ...formData, id: Date.now() });
    }

    setFormData({
      nome: "",
      email: "",
      curso: "",
      semestre: "",
    });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer"
      >
        {editingStudent ? "Salvar Alterações" : "Cadastrar"}
      </button>
    </form>
  );
}
