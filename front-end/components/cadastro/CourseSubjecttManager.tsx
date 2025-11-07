"use client";

import { useState, useEffect } from "react";
import { Course, Subject } from "@/types/Course";
import { getSubjects } from "@/lib/api/subject";
import { addSubjectToCourse, removeSubjectFromCourse } from "@/lib/api/course";

interface CourseSubjectsManagerProps {
  course: Course;
  onClose: () => void;
  onUpdated: () => void;
}

export default function CourseSubjectsManager({
  course,
  onClose,
  onUpdated,
}: CourseSubjectsManagerProps) {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(course.subjects || []);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setAllSubjects(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setAllSubjects([]);
      } else {
        console.error("Erro ao buscar matérias:", error);
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (selectedSubjectIds.length === 0) return;
    setIsLoading(true);
    try {
      for (const subjectId of selectedSubjectIds) {
        await addSubjectToCourse(course.id, subjectId);
        const added = allSubjects.find((s) => s.subjectId === subjectId);
        if (added) setSubjects((prev) => [...prev, added]);
      }
      setSelectedSubjectIds([]);
      setIsDropdownOpen(false);
      onUpdated();
    } catch (e) {
      console.error("Erro ao adicionar matérias:", e);
      alert("Erro ao adicionar matérias ao curso.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    if (!confirm("Deseja remover esta matéria do curso?")) return;
    setIsLoading(true);
    try {
      await removeSubjectFromCourse(course.id, subjectId);
      setSubjects((prev) => prev.filter((s) => s.subjectId !== subjectId));
      onUpdated();
    } catch (e) {
      console.error("Erro ao remover matéria:", e);
      alert("Erro ao remover matéria do curso.");
    } finally {
      setIsLoading(false);
    }
  };

  const availableSubjects = allSubjects.filter(
    (s) => !subjects.some((sub) => sub.subjectId === s.subjectId),
  );

  const toggleSubject = (id: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Gerenciar Matérias — {course.courseName}
      </h2>

      <div className="flex gap-3 mb-6 relative">
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((o) => !o)}
            className="w-full bg-[#1a1a1dc3] border border-orange-400/30 text-white px-4 py-2 rounded-xl text-left cursor-pointer"
          >
            {selectedSubjectIds.length > 0
              ? `${selectedSubjectIds.length} selecionada(s)`
              : "Selecione matérias..."}
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-[#1a1a1d] border border-orange-400/30 rounded-xl max-h-60 overflow-y-auto shadow-lg">
              {availableSubjects.length === 0 ? (
                <p className="text-gray-400 text-center py-2">
                  Nenhuma matéria disponível
                </p>
              ) : (
                availableSubjects.map((s) => (
                  <label
                    key={s.subjectId}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjectIds.includes(s.subjectId)}
                      onChange={() => toggleSubject(s.subjectId)}
                    />
                    <span>{s.subjectName}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleAddSubject}
          disabled={selectedSubjectIds.length === 0 || isLoading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition disabled:opacity-50 cursor-pointer"
        >
          Adicionar
        </button>
      </div>

      {/* --- Tabela de matérias --- */}
      <div className="border border-orange-400/30 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-orange-400 text-sm uppercase">
              <th className="px-4 py-3 text-left">Matéria</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhuma matéria associada
                </td>
              </tr>
            ) : (
              subjects.map((s) => (
                <tr
                  key={s.subjectId}
                  className="border-t border-orange-500/30 hover:bg-neutral-900"
                >
                  <td className="px-4 py-3">{s.subjectName}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemoveSubject(s.subjectId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-xl transition cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
