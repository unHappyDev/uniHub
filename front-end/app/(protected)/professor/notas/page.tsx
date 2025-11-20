"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClassroomsByProfessor } from "@/lib/api/classroom";
import { Classroom } from "@/types/Classroom";

export default function GradePage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getClassroomsByProfessor();
      setClassrooms(data);
    }
    load();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Minhas Turmas</h1>

      <table className="w-full border rounded">
        <thead>
          <tr>
            <th className="p-3 text-left">Turma</th>
            <th className="p-3 text-left">Semestre</th>
            <th className="p-3 text-left">Ações</th>
          </tr>
        </thead>

        <tbody>
          {classrooms.map((c) => (
            <tr key={c.classroomId} className="border-b">
              <td className="p-3">{c.subject}</td>
              <td className="p-3">{c.semester}</td>
              <td className="p-3">
                <Link
                  href={`/professor/notas/classroom/${c.classroomId}`}
                  className="px-4 py-2 bg-orange-500 rounded text-white"
                >
                  Ver turma
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
