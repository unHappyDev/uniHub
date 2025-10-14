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
      <div className="overflow-x-auto border border-orange-400 rounded-xl">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="bg-neutral-800 border-b border-orange-400 uppercase text-sm">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Semestre</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-400 bg-neutral-900 rounded-b-xl"
                >
                  Nenhum aluno cadastrado
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-neutral-700 hover:bg-neutral-800 transition-colors"
                >
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3">{s.nome}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.curso}</td>
                  <td className="px-4 py-3">{s.semestre}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(s)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => s.id && onDelete(s.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
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
