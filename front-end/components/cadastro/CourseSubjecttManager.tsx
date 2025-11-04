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
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
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
        console.error(" Erro ao buscar matérias:", error);
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (!selectedSubjectId) return;

    setIsLoading(true);
    try {
      await addSubjectToCourse(course.id, selectedSubjectId);

      const added = allSubjects.find((s) => s.subjectId === selectedSubjectId);
      if (added) setSubjects((prev) => [...prev, added]);
      setSelectedSubjectId("");
      onUpdated();
    } catch (e) {
      console.error("Erro ao adicionar matéria:", e);
      alert("Erro ao adicionar matéria ao curso.");
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

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Gerenciar Matérias — {course.courseName}
      </h2>

      <div className="flex gap-3 mb-6">
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="flex-1 bg-[#1a1a1dc3] border border-orange-400/30 text-white px-4 py-2 rounded-xl outline-none"
        >
          <option value="">Selecione uma matéria...</option>
          {availableSubjects.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>
              {s.subjectName}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddSubject}
          disabled={!selectedSubjectId || isLoading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition disabled:opacity-50"
        >
          Adicionar
        </button>
      </div>

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
