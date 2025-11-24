import { HorarioDTO } from "@/lib/api/horario";

interface Props {
  horarios: HorarioDTO[];
  filtroPeriodo: "manhã" | "noite";
}

const dias = [
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
];

// Intervalos fixos
const FIXED_INTERVALS = [
  { start: "07:45", end: "08:35" },
  { start: "08:35", end: "09:25" },
  { start: "09:40", end: "10:30" },
  { start: "10:30", end: "11:20" },
  { start: "19:00", end: "19:50" },
  { start: "19:50", end: "20:40" },
  { start: "20:55", end: "21:45" },
  { start: "21:45", end: "22:35" },
];

export default function ProfessorHorarioTable({ horarios, filtroPeriodo }: Props) {
  const filteredIntervals = FIXED_INTERVALS.filter(({ start }) => {
    const [h] = start.split(":").map(Number);
    if (filtroPeriodo === "manhã") return h < 12;
    if (filtroPeriodo === "noite") return h >= 17;
    return true;
  });

  const getAula = (start: string, dia: string) =>
    horarios.find(
      (h) =>
        h.startAt?.substring(0, 5) === start &&
        h.dayOfWeek?.toUpperCase() === dia.toUpperCase()
    );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full text-white rounded-xl table-fixed">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left w-32">Horário</th>
              {dias.map((dia) => (
                <th key={dia} className="px-4 py-3 text-center w-32">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredIntervals.map(({ start, end }) => (
              <tr key={start} className="border-t border-orange-500/30">
                <td className="px-4 py-3 font-semibold h-20 w-32 truncate">
                  {start} → {end}
                </td>
                {dias.map((dia) => {
                  const aula = getAula(start, dia);
                  return (
                    <td
                      key={dia}
                      className="px-4 py-3 text-center align-center h-20 w-32 truncate overflow-hidden"
                    >
                      {aula ? (
                        <>
                          <div className="font-semibold truncate uppercase">
                            {aula.subjectName || "—"}
                          </div>
                          <div className="text-sm text-orange-300 truncate">
                            {`Semestre ${aula.semester || "—"}`}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow transition-all hover:shadow-orange-500/30 scrollbar-thin scrollbar-thumb-orange-500/70 scrollbar-track-orange-900/10 scrollbar-thumb-rounded-lg">
        <table className="min-w-max text-white table-fixed">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left w-32">Horário</th>
              {dias.map((dia) => (
                <th key={dia} className="px-4 py-3 text-center w-32">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredIntervals.map(({ start, end }) => (
              <tr key={start} className="border-t border-orange-500/30">
                <td className="px-4 py-2 font-semibold w-32 truncate">
                  {start} → {end}
                </td>
                {dias.map((dia) => {
                  const aula = getAula(start, dia);
                  return (
                    <td
                      key={dia}
                      className="px-4 py-2 text-center align-top w-32 max-w-[120px] truncate overflow-hidden"
                    >
                      {aula ? (
                        <>
                          <div className="font-semibold truncate uppercase">
                            {aula.subjectName || "—"}
                          </div>
                          <div className="text-sm text-orange-300 truncate">
                            {`Semestre ${aula.semester || "—"}`}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
