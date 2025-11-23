import { HorarioDTO } from "@/lib/api/horario";

interface Props {
  horarios: HorarioDTO[];
}

const dias = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];

export default function HorarioTable({ horarios }: Props) {
  const horariosPorHora = Array.from(
    new Set(horarios.map((h) => `${h.startAt} às ${h.endAt}`))
  );

  const getAula = (hora: string, dia: string) => {
    return horarios.find(
      (h) =>
        `${h.startAt} às ${h.endAt}` === hora &&
        h.dayOfWeek.toUpperCase() === dia.toUpperCase()
    );
  };

  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr>
          <th className="border p-2">Horário</th>
          {dias.map((dia) => (
            <th key={dia} className="border p-2">
              {dia}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {horariosPorHora.map((hora) => (
          <tr key={hora}>
            <td className="border p-2">{hora}</td>
            {dias.map((dia) => {
              const aula = getAula(hora, dia);
              return (
                <td key={dia} className="border p-2 align-top">
                  {aula ? (
                    <>
                      <div className="font-semibold">{aula.subjectName}</div>
                      <div>{aula.professorName}</div>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
