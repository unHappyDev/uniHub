import { HorarioDTO } from "@/lib/api/horario";

interface Props {
  horarios: HorarioDTO[];
  filtroPeriodo: "manhã" | "noite" | "todos";
}

const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];

const FIXED_TIMES = [
  "07:50","08:40","09:30","09:45","10:35","11:25",
  "19:00","19:50","20:40","20:55","21:45","22:35",
];

export default function HorarioTable({ horarios, filtroPeriodo }: Props) {
  const filteredTimes = FIXED_TIMES.filter((hora) => {
    const [h] = hora.split(":").map(Number);
    if (filtroPeriodo === "manhã") return h < 12;
    if (filtroPeriodo === "noite") return h >= 18;
    return true;
  });

  const getAula = (hora: string, dia: string) =>
    horarios.find(
      (h) =>
        h.startAt?.substring(0, 5) === hora &&
        h.dayOfWeek?.toUpperCase() === dia.toUpperCase()
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full text-white rounded-xl table-fixed">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left w-24">Horário</th>
              {dias.map((dia) => (
                <th key={dia} className="px-4 py-3 text-center">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTimes.map((hora) => (
              <tr key={hora} className="border-t border-orange-500/30">
                <td className="px-4 py-3 font-semibold h-20">{hora}</td>
                {dias.map((dia) => {
                  const aula = getAula(hora, dia);
                  return (
                    <td
                      key={dia}
                      className="px-4 py-3 text-center align-top h-20 overflow-hidden"
                    >
                      {aula ? (
                        <>
                          <div className="font-semibold truncate">{aula.subjectName || "—"}</div>
                          <div className="truncate">{aula.professorName || "—"}</div>
                        </>
                      ) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile - tabela horizontal rolável */}
   <div className="md:hidden overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow transition-all hover:shadow-orange-500/30
                scrollbar-thin scrollbar-thumb-orange-500/70 scrollbar-track-orange-900/10 scrollbar-thumb-rounded-lg">
  <table className="min-w-max text-white table-fixed">
    <thead>
      <tr className="text-orange-400 uppercase text-sm">
        <th className="px-4 py-3 text-left w-20">Horário</th>
        {dias.map((dia) => (
          <th key={dia} className="px-4 py-3 text-center">{dia}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredTimes.map((hora) => (
        <tr key={hora} className="border-t border-orange-500/30">
          <td className="px-4 py-2 font-semibold">{hora}</td>
          {dias.map((dia) => {
            const aula = getAula(hora, dia);
            return (
              <td key={dia} className="px-4 py-2 text-center align-top max-w-[120px] overflow-hidden">
                {aula ? (
                  <>
                    <div className="font-semibold truncate">{aula.subjectName || "—"}</div>
                    <div className="truncate">{aula.professorName || "—"}</div>
                  </>
                ) : "—"}
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
