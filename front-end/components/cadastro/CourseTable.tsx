"use client";

import React from "react";
import { Course } from "@/types/Course";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

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
  const sortedCourses = [...courses].sort((a, b) =>
    a.courseName.localeCompare(b.courseName, "pt", { sensitivity: "base" }),
  );

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
            {sortedCourses.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhum curso cadastrado
                </td>
              </tr>
            ) : (
              sortedCourses.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-orange-500/30 transition"
                >
                  <td className="px-4 py-3">{c.courseName}</td>
                  <td className="px-4 py-3">{c.subjects?.length ?? 0}</td>
                  <td className="px-4 py-3">{c.countStudents ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(c)}
                        className="flex items-center gap-1 text-green-400 hover:text-green-500 transition cursor-pointer"
                      >
                        <Pencil size={16} /> Editar
                      </button>

                      <button
                        onClick={() => c.id && onDelete(c.id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 size={16} /> Excluir
                      </button>

                      <button
                        onClick={() => onManageSubjects(c)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-500 transition cursor-pointer"
                      >
                        <BookOpen size={16} /> Matérias
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
        {sortedCourses.length === 0 ? (
          <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
            Nenhum curso cadastrado
          </div>
        ) : (
          sortedCourses.map((c) => (
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
                {c.countStudents ?? 0}
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(c)}
                  className="flex items-center gap-1 text-green-400 hover:text-green-500 transition cursor-pointer"
                >
                  <Pencil size={16} /> Editar
                </button>

                <button
                  onClick={() => c.id && onDelete(c.id)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={16} /> Excluir
                </button>

                <button
                  onClick={() => onManageSubjects(c)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-500 transition cursor-pointer"
                >
                  <BookOpen size={16} /> Matérias
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
