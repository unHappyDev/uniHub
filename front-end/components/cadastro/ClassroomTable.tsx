"use client";

import React from "react";
import { Classroom } from "@/types/Classroom";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  classrooms: Classroom[];
  onEdit: (c: Classroom) => void;
  onDelete: (id: string) => void;
}

export default function ClassroomTable({
  classrooms,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Professor
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Matéria</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Semestre
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Início</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Término</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Alunos</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhuma turma cadastrada
                </td>
              </tr>
            ) : (
              classrooms.map((c) => (
                <tr
                  key={c.classroomId}
                  className="border-t border-orange-500/30 transition hover:bg-neutral-900"
                >
                  <td className="px-4 py-3">{c.professor}</td>
                  <td className="px-4 py-3">{c.subject}</td>
                  <td className="px-4 py-3">{c.semester}</td>
                  <td className="px-4 py-3">
                    {new Date(c.startAt).toLocaleDateString("pt-BR")}{" "}
                    {new Date(c.startAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(c.endAt).toLocaleDateString("pt-BR")}{" "}
                    {new Date(c.endAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.students?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(c)}
                        className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        onClick={() => onDelete(c.classroomId)}
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
        {classrooms.length === 0 ? (
          <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
            Nenhuma turma cadastrada
          </div>
        ) : (
          classrooms.map((c) => (
            <div
              key={c.classroomId}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-7 text-gray-200 shadow-glow transition-all hover:shadow-orange-500/30"
            >
              <p>
                <span className="font-semibold text-orange-500">
                  Professor:
                </span>{" "}
                {c.professor || "—"}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Matéria:</span>{" "}
                {c.subject || "—"}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Semestre:</span>{" "}
                {c.semester}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Início:</span>{" "}
                {new Date(c.startAt).toLocaleString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Término:</span>{" "}
                {new Date(c.endAt).toLocaleString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Alunos:</span>{" "}
                {c.students?.length || 0}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(c)}
                  className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={16} /> Editar
                </button>
                <button
                  onClick={() => onDelete(c.classroomId)}
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
