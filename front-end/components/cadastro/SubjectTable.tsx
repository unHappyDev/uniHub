"use client";

import { Subject } from "@/types/Subject";

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
                  key={s.id}
                  className="border-t border-orange-500/30 hover:bg-neutral-900 transition"
                >
                  <td className="px-4 py-3">{s.subjectName}</td>
                  <td className="px-4 py-3">{s.workloadHours}h</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(s)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
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
    </div>
  );
}
