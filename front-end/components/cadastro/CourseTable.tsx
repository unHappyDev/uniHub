"use client";

import React from "react";
import { Course } from "@/types/Course";

interface CourseTableProps {
  courses: Course[];
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (course: Course) => void;
  onManageSubjects: (course: Course) => void;
}

export default function CourseTable({
  courses,
  onDelete,
  onEdit,
  onManageSubjects,
}: CourseTableProps) {
  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Nome do Curso
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Qtd. Matérias
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Qtd. Alunos
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhum curso cadastrado
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-orange-500/30 transition hover:bg-neutral-900"
                >
                  <td className="px-4 py-3">{c.courseName}</td>
                  <td className="px-4 py-3">{c.subjects?.length ?? 0}</td>
                  <td className="px-4 py-3">{c.studentCount ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(c)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => c.id && onDelete(c.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Excluir
                      </button>
                      <button
                        onClick={() => onManageSubjects(c)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Matérias
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
        {courses.length === 0 ? (
          <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
            Nenhum curso cadastrado
          </div>
        ) : (
          courses.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
            >
              <p>
                <span className="font-semibold text-orange-500">Curso:</span>{" "}
                {c.courseName}
              </p>
              <p>
                <span className="font-semibold text-orange-500">
                  Qtd. Matérias:
                </span>{" "}
                {c.subjects?.length ?? 0}
              </p>
              <p>
                <span className="font-semibold text-orange-500">
                  Qtd. Alunos:
                </span>{" "}
                {c.studentCount ?? 0}
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(c)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => c.id && onDelete(c.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Excluir
                </button>
                <button
                  onClick={() => onManageSubjects(c)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Matérias
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
