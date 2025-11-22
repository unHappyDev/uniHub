"use client";
import { Activity, Grade } from "@/types/Grade";
import { Button } from "@/components/ui/button";

const activityLabels: Record<Activity, string> = {
  prova: "Prova",
  trabalho: "Trabalho",
  recuperacao: "Recuperação",
  extra: "Extra",
};

interface SimpleStudent {
  id: string;
  nome: string;
}

interface Props {
  students: SimpleStudent[];
  grades: Grade[];
  classroomId: string;
  onEdit: (student: SimpleStudent) => void;
}

export default function GradeTable({ students, grades, onEdit }: Props) {
  const sortedStudents = [...students].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }),
  );

  const calculateBimesterAverages = (
    studentGrades: Grade[],
  ): { [bimester: number]: number; total: number | null } => {
    if (!studentGrades.length) return { total: null };

    const bimesterSums: { [bimester: number]: number } = {};

    const totalExtra = studentGrades
      .filter((g) => g.activity === "extra")
      .reduce((sum, g) => sum + g.grade, 0);

    [1, 2].forEach((bim) => {
      const gradesBim = studentGrades.filter((g) => g.bimester === bim);

      const prova = gradesBim.find((g) => g.activity === "prova")?.grade ?? 0;
      const recuperacao =
        gradesBim.find((g) => g.activity === "recuperacao")?.grade ?? 0;
      const maiorPR = Math.max(prova, recuperacao);

      const trabalhos = gradesBim
        .filter((g) => g.activity === "trabalho")
        .map((g) => g.grade);

      let mb = maiorPR + trabalhos.reduce((a, b) => a + b, 0);

      mb += totalExtra / 2;

      bimesterSums[bim] = parseFloat(mb.toFixed(1));
    });

    const b1Complete = (() => {
      const gradesB1 = studentGrades.filter((g) => g.bimester === 1);
      const pr = gradesB1.find(
        (g) => g.activity === "prova" || g.activity === "recuperacao",
      );
      const trab = gradesB1.find((g) => g.activity === "trabalho");
      return !!pr && !!trab;
    })();

    const b2Complete = (() => {
      const gradesB2 = studentGrades.filter((g) => g.bimester === 2);
      const pr = gradesB2.find(
        (g) => g.activity === "prova" || g.activity === "recuperacao",
      );
      const trab = gradesB2.find((g) => g.activity === "trabalho");
      return !!pr && !!trab;
    })();

    let totalAverage: number | null = null;
    if (b1Complete && b2Complete) {
      totalAverage = (bimesterSums[1] + bimesterSums[2]) / 2;
      totalAverage = parseFloat(totalAverage.toFixed(1));
    }

    return { ...bimesterSums, total: totalAverage };
  };

  const getTotalColor = (b1: number | null, b2: number | null) => {
  if (b1 === null || b2 === null) return "text-gray-400";

  const media = (b1 + b2) / 2;

  return media >= 7
    ? "text-green-500 font-semibold"
    : "text-red-500 font-semibold";
};

  const columns: { activity: Activity; bimester?: number }[] = [
    { activity: "prova", bimester: 1 },
    { activity: "recuperacao", bimester: 1 },
    { activity: "trabalho", bimester: 1 },
    { activity: "prova", bimester: 2 },
    { activity: "recuperacao", bimester: 2 },
    { activity: "trabalho", bimester: 2 },
    { activity: "extra" },
  ];

  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full text-white rounded-xl">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Aluno</th>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-center">
                  {col.activity === "extra"
                    ? "Extra"
                    : `${activityLabels[col.activity]} B${col.bimester}`}
                </th>
              ))}
              <th className="px-4 py-3 text-center">MB1</th>
              <th className="px-4 py-3 text-center">MB2</th>
              <th className="px-4 py-3 text-center">Média Total</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => {
              const studentGrades = grades.filter(
                (g) => g.studentId === student.id,
              );
              const averages = calculateBimesterAverages(studentGrades);

              return (
                <tr key={student.id} className="border-t border-orange-500/30">
                  <td className="px-4 py-3">{student.nome}</td>
                  {columns.map((col, idx) => {
                    const grade = studentGrades.find(
                      (g) =>
                        g.activity === col.activity &&
                        (col.bimester ? g.bimester === col.bimester : true),
                    );
                    return (
                      <td key={idx} className="px-4 py-3 text-center">
                        {grade ? grade.grade.toFixed(1) : "-"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    {averages[1]?.toFixed(1) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {averages[2]?.toFixed(1) ?? "-"}
                  </td>
                  <td
                    className={`px-4 py-3 text-center ${getTotalColor(
                      averages[1] ?? null,
                      averages[2] ?? null,
                    )}`}
                  >
                    {averages.total?.toFixed(1) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      className="bg-orange-500/70 hover:bg-orange-600/70 text-white"
                      onClick={() => onEdit(student)}
                    >
                      Editar Nota
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-6">
        {sortedStudents.map((student) => {
          const studentGrades = grades.filter(
            (g) => g.studentId === student.id,
          );
          const averages = calculateBimesterAverages(studentGrades);

          return (
            <div
              key={student.id}
              className="bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
            >
              <p className="font-semibold text-orange-500 mb-2">
                {student.nome}
              </p>
              <div className="flex flex-col gap-2">
                {columns.map((col, idx) => {
                  const grade = studentGrades.find(
                    (g) =>
                      g.activity === col.activity &&
                      (col.bimester ? g.bimester === col.bimester : true),
                  );
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-[#121212b0] p-2 rounded-md"
                    >
                      <span className="capitalize font-medium">
                        {col.activity === "extra"
                          ? "Extra"
                          : `${activityLabels[col.activity]} B${col.bimester}`}
                      </span>
                      <span>{grade ? grade.grade.toFixed(1) : "-"}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center bg-[#1a1a1ab0] p-2 rounded-md mt-2">
                  <span>MB1</span>
                  <span>{averages[1]?.toFixed(1) ?? "-"}</span>
                </div>
                <div className="flex justify-between items-center bg-[#1a1a1ab0] p-2 rounded-md mt-1">
                  <span>MB2</span>
                  <span>{averages[2]?.toFixed(1) ?? "-"}</span>
                </div>
                <div
                  className={`flex justify-between items-center bg-[#1a1a1ab0] p-2 rounded-md mt-1 ${getTotalColor(
                    averages[1] ?? null,
                    averages[2] ?? null,
                  )}`}
                >
                  <span>Média Total</span>
                  <span>{averages.total?.toFixed(1) ?? "-"}</span>
                </div>

                <Button
                  size="sm"
                  className="mt-2 bg-orange-500/70 hover:bg-orange-600/70 text-white cursor-pointer transition-all"
                  onClick={() => onEdit(student)}
                >
                  Editar Nota
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
