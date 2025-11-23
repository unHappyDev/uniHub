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
  presence?: Record<string, { present: boolean; absent: boolean }>;
  togglePresence?: (studentId: string, type: "present" | "absent") => void;
  showAbsencesOnly?: boolean;
}

export default function AttendanceTable({
  students,
  scheduleId,
  presence = {},
  togglePresence,
  showAbsencesOnly = false,
}: Props) {
  const sorted = [...students].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
  );

  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full text-white rounded-xl">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Aluno</th>
              <th className="px-4 py-3 text-center">
                {showAbsencesOnly ? "Total de Faltas" : "Presença / Falta"}
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-t border-orange-500/30">
                <td className="px-4 py-3">{s.nome}</td>

                <td className="px-4 py-3 text-center">
                  {showAbsencesOnly ? (
                    <span>{s.totalAbsences ?? 0}</span>
                  ) : scheduleId && togglePresence ? (
                    <div className="flex justify-center items-center gap-6">
                      {/* Presença */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={presence[s.id]?.present ?? false}
                          onChange={() => togglePresence(s.id, "present")}
                          className="w-5 h-5 accent-green-500"
                        />
                        <span>Presença</span>
                      </label>

                      {/* Falta */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={presence[s.id]?.absent ?? false}
                          onChange={() => togglePresence(s.id, "absent")}
                          className="w-5 h-5 accent-red-500"
                        />
                        <span>Falta</span>
                      </label>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-6">
        {sorted.map((s) => (
          <div
            key={s.id}
            className="bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
          >
            <p className="font-semibold text-orange-500 mb-3">{s.nome}</p>

            {showAbsencesOnly ? (
              <div className="flex justify-between items-center bg-[#121212b0] p-2 rounded-md">
                <span>Total de Faltas</span>
                <span>{s.totalAbsences ?? 0}</span>
              </div>
            ) : (
              scheduleId &&
              togglePresence && (
                <div className="flex justify-between items-center bg-[#121212b0] p-2 rounded-md">
                  <div className="flex flex-col gap-2">

                    {/* Presença */}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={presence[s.id]?.present ?? false}
                        onChange={() => togglePresence(s.id, "present")}
                        className="w-6 h-6 accent-green-500"
                      />
                      <span>Presença</span>
                    </label>

                    {/* Falta */}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={presence[s.id]?.absent ?? false}
                        onChange={() => togglePresence(s.id, "absent")}
                        className="w-6 h-6 accent-red-500"
                      />
                      <span>Falta</span>
                    </label>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
