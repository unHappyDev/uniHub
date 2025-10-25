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
      {/* Versão Desktop*/}
      <div className="hidden md:block overflow-x-auto border border-orange-400 rounded-xl">
        <table className="min-w-full bg-neutral-950 rounded-xl text-white">
          <thead>
            <tr className="bg-neutral-800 text-orange-400 uppercase text-sm">
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
                  className="border-t border-neutral-700 transition hover:bg-neutral-800"
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

      {/*Versão Mobile*/}
      <div className="md:hidden flex flex-col gap-4">
        {students.length === 0 ? (
          <div className="text-center text-gray-400 py-6 border border-orange-500 rounded-xl bg-neutral-900">
            Nenhum aluno cadastrado
          </div>
        ) : (
          students.map((s) => (
            <div
              key={s.id}
              className="bg-neutral-900 border border-orange-500 rounded-xl p-4 text-gray-200"
            >
              <p>
                <span className="font-semibold text-orange-400">Nome:</span>{" "}
                {s.nome}
              </p>
              <p>
                <span className="font-semibold text-orange-400">Email:</span>{" "}
                {s.email}
              </p>
              <p>
                <span className="font-semibold text-orange-400">Curso:</span>{" "}
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
