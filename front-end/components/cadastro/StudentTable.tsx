"use client";

import React from "react";
import { Student } from "@/types/Student";

interface StudentTableProps {
  students: Student[];
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (student: Student) => void;
}

export default function StudentTable({
  students,
  onDelete,
  onEdit,
}: StudentTableProps) {
  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto  bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full  rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left whitespace-nowrap">Nome</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Curso</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhum aluno cadastrado
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-orange-500/30 transition hover:bg-neutral-900"
                >
                  <td className="px-4 py-3">{s.nome}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">
                    {typeof s.curso === "string"
                      ? s.curso
                      : s.curso?.courseName || "—"}
                  </td>
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

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-6">
        {students.length === 0 ? (
          <div className="text-center text-gray-400  bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
            Nenhum aluno cadastrado
          </div>
        ) : (
          students.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-7  text-gray-200 shadow-glow transition-all hover:shadow-orange-500/30"
            >
              <p>
                <span className="font-semibold text-orange-500">Nome:</span>{" "}
                {s.nome}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Email:</span>{" "}
                {s.email}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Curso:</span>{" "}
                {typeof s.curso === "string"
                  ? s.curso
                  : s.curso?.courseName || "—"}
              </p>

              <div className="flex justify-end gap-2 mt-3">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
