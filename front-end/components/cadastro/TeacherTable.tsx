"use client";

import React from "react";
import { Teacher } from "@/types/Teacher";
import { Pencil, Trash2 } from "lucide-react";

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
      <div className="hidden md:block overflow-x-auto  bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full  rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
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
                  className="border-t border-orange-500/30 transition"
                >
                  <td className="px-4 py-3">{t.nome}</td>
                  <td className="px-4 py-3">{t.email}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(t)}
                        className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        onClick={() => t.id && onDelete(t.id)}
                        className="text-red-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={16} /> Excluir
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
        {teachers.length === 0 ? (
          <div className="text-center text-gray-400  bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
            Nenhum professor cadastrado
          </div>
        ) : (
          teachers.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-7  text-gray-200 shadow-glow transition-all hover:shadow-orange-500/30"
            >
              <p>
                <span className="font-semibold text-orange-500">Nome:</span>{" "}
                {t.nome}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Email:</span>{" "}
                {t.email}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(t)}
                  className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={16} /> Editar
                </button>
                <button
                  onClick={() => t.id && onDelete(t.id)}
                  className="text-red-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
