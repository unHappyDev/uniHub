"use client";

import { Subject } from "@/types/Subject";
import { Pencil, Trash2 } from "lucide-react";

interface SubjectTableProps {
  subjects: Subject[];
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (subject: Subject) => void;
}

export default function SubjectTable({
  subjects,
  onDelete,
  onEdit,
}: SubjectTableProps) {
  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Matéria</th>
              <th className="px-4 py-3 text-left">Carga Horária</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhuma matéria cadastrada
                </td>
              </tr>
            ) : (
              subjects.map((s) => (
                <tr
                  key={s.subjectId}
                  className="border-t border-orange-500/30 transition"
                >
                  <td className="px-4 py-3">{s.subjectName}</td>
                  <td className="px-4 py-3">{s.workloadHours}h</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(s)}
                        className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        onClick={() => onDelete(s.subjectId)}
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
        {subjects.length === 0 ? (
          <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
            Nenhuma matéria cadastrada
          </div>
        ) : (
          subjects.map((s) => (
            <div
              key={s.subjectId}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
            >
              <p>
                <span className="font-semibold text-orange-500">Matéria:</span>{" "}
                {s.subjectName}
              </p>
              <p>
                <span className="font-semibold text-orange-500">
                  Carga Horária:
                </span>{" "}
                {s.workloadHours}h
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(s)}
                  className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={16} /> Editar
                </button>
                <button
                  onClick={() => onDelete(s.subjectId)}
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
