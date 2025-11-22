"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClassroomsByProfessor } from "@/lib/api/classroom";
import { Classroom } from "@/types/Classroom";
import { Modal } from "@/components/ui/modal";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function GradePage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [viewingClassroom, setViewingClassroom] = useState<Classroom | null>(null);

  const [filterSubject, setFilterSubject] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  useEffect(() => {
  async function load() {
    try {
      const data = await getClassroomsByProfessor();

      const list = Array.isArray(data) ? data : [];

      setClassrooms(list);
      setFilteredClassrooms(list);
    } catch (error: any) {
      if (error.response?.status === 404) {
 
        setClassrooms([]);
        setFilteredClassrooms([]);
      } else {
        console.error("Erro ao buscar turmas:", error);
        toast.error("Erro ao carregar turmas.");
      }
    }
  }

  load();
}, []);
  useEffect(() => {
    const filtered = classrooms.filter(
      (c) =>
        c.subject.toLowerCase().includes(filterSubject.toLowerCase()) &&
        c.semester.toLowerCase().includes(filterSemester.toLowerCase())
    );
    setFilteredClassrooms(filtered);
  }, [filterSubject, filterSemester, classrooms]);

  const closeModal = () => setViewingClassroom(null);

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
          Minhas Turmas
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Filtrar por turma..."
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <input
              type="text"
              placeholder="Filtrar por semestre..."
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
          </div>
        </div>

        <div className="mt-6">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
            <table className="min-w-full rounded-xl text-white">
              <thead>
                <tr className="text-orange-400 uppercase text-sm">
                  <th className="px-4 py-3 text-left">Turma</th>
                  <th className="px-4 py-3 text-left">Semestre</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassrooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-6 text-gray-400 bg-neutral-900"
                    >
                      Nenhuma turma encontrada
                    </td>
                  </tr>
                ) : (
                  filteredClassrooms.map((c) => (
                    <tr
                      key={c.classroomId}
                      className="border-t border-orange-500/30 transition"
                    >
                      <td className="px-4 py-3">{c.subject}</td>
                      <td className="px-4 py-3">{c.semester}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            href={`/professor/chamada/classroom/${c.classroomId}`}
                            className="text-blue-400 hover:text-blue-500 transition flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil size={16} /> Ver
                          </Link>
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
            {filteredClassrooms.length === 0 ? (
              <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
                Nenhuma turma encontrada
              </div>
            ) : (
              filteredClassrooms.map((c) => (
                <div
                  key={c.classroomId}
                  className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
                >
                  <p>
                    <span className="font-semibold text-orange-500">Turma:</span>{" "}
                    {c.subject}
                  </p>
                  <p>
                    <span className="font-semibold text-orange-500">Semestre:</span>{" "}
                    {c.semester}
                  </p>
                  <div className="flex justify-end gap-2 mt-3">
                    <Link
                      href={`/professor/chamada/classroom/${c.classroomId}`}
                      className="text-blue-400 hover:text-blue-500 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil size={16} /> Ver
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {viewingClassroom && (
          <Modal isOpen={!!viewingClassroom} onClose={closeModal}>
            <div className="text-white max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-orange-400 mb-2 text-center">
                {viewingClassroom.subject}
              </h2>
              <p className="text-sm text-gray-400 text-center mb-6">
                Semestre: {viewingClassroom.semester}
              </p>
              <div className="bg-[#121212b0] border border-orange-400/20 rounded-xl p-5 text-gray-200 whitespace-pre-line leading-relaxed">
                ID da turma: {viewingClassroom.classroomId} <br />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
