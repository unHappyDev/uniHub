"use client";

import React from "react";
import { Teacher } from "@/types/Teacher";

interface TeacherTableProps {
  teachers: Teacher[];
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (teacher: Teacher) => void;
}

export default function TeacherTable({
  teachers,
  onDelete,
  onEdit,
}: TeacherTableProps) {
  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto border border-orange-400 rounded-xl">
        <table className="min-w-full bg-neutral-950 rounded-xl text-white">
          <thead>
            <tr className="bg-neutral-800 text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhum professor cadastrado
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800"
                >
                  <td className="px-4 py-3">{t.nome}</td>
                  <td className="px-4 py-3">{t.email}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(t)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => t.id && onDelete(t.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
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
      <div className="md:hidden flex flex-col gap-4">
        {teachers.length === 0 ? (
          <div className="text-center text-gray-400 py-6 border border-orange-500 rounded-xl bg-neutral-900">
            Nenhum professor cadastrado
          </div>
        ) : (
          teachers.map((t) => (
            <div
              key={t.id}
              className="bg-neutral-900 border border-orange-500 rounded-xl p-4 text-gray-200"
            >
              <p>
                <span className="font-semibold text-orange-400">Nome:</span>{" "}
                {t.nome}
              </p>
              <p>
                <span className="font-semibold text-orange-400">Email:</span>{" "}
                {t.email}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(t)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => t.id && onDelete(t.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
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
