"use client";

import { Student } from "@/types/Student";

interface EnrolledStudent extends Student {
  id: string;
  nome: string;
  totalAbsences?: number;
}

interface Props {
  students: EnrolledStudent[];
  scheduleId?: string;
  presence?: Record<string, boolean>;
  toggle?: (studentId: string) => void;
  showAbsencesOnly?: boolean;
}

export default function AttendanceTable({
  students,
  scheduleId,
  presence,
  toggle,
  showAbsencesOnly = false,
}: Props) {
  return (
    <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
      <table className="w-full border-collapse border border-gray-700 text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 text-left">Aluno</th>
            <th className="p-2 text-center">
              {showAbsencesOnly
                ? "Total de Faltas"
                : scheduleId
                  ? "Presença"
                  : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className="border-t border-gray-700 hover:bg-gray-900 transition"
            >
              <td className="p-2">{s.nome}</td>
              <td className="p-2 text-center">
                {showAbsencesOnly ? (
                  (s.totalAbsences ?? 0)
                ) : scheduleId && presence && toggle ? (
                  <input
                    id={`chk-${s.id}`}
                    type="checkbox"
                    checked={presence[s.id] ?? false}
                    onChange={() => toggle(s.id)}
                    className="w-5 h-5 accent-orange-500"
                  />
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
