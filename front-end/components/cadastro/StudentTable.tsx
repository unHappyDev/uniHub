"use client";
import React from "react";
import { Student } from "@/types/Student";

interface StudentTableProps {
  students: Student[];
  onDelete: (id: number) => Promise<void> | void;
  onEdit: (student: Student) => void;
}

export default function StudentTable({ students, onDelete, onEdit }: StudentTableProps) {
  return (
    <div className="mt-6">
      <div className="hidden md:block overflow-x-auto border border-orange-400 rounded-xl">
        <table className="min-w-full bg-neutral-950 rounded-xl text-white">
          <thead>
            <tr className="bg-neutral-800 text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Curso</th>
              <th className="px-4 py-3 text-left">Semestre</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400 bg-neutral-900">
                  Nenhum aluno cadastrado
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800 transition"
                >
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3">{s.nome}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.curso}</td>
                  <td className="px-4 py-3">{s.semestre}</td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(s)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(s.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
