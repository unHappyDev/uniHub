"use client";
import { Activity, Grade } from "@/types/Grade";
import { Button } from "@/components/ui/button";

const ACTIVITIES: Activity[] = ["prova", "trabalho", "recuperacao", "extra"];

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
  onEdit: (grade: Grade) => void;
  onAdd: (student: SimpleStudent, activity: Activity) => void;
}

export default function GradeTable({ students, grades, onEdit, onAdd }: Props) {
  const sortedStudents = [...students].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }),
  );

  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Aluno</th>
              {ACTIVITIES.map((a) => (
                <th
                  key={`header-${a}`}
                  className="px-4 py-3 text-center uppercase"
                >
                  {activityLabels[a]}
                </th>
              ))}
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => {
              const studentGrades = grades.filter(
                (g) => g.studentId === student.id,
              );
              return (
                <tr key={student.id} className="border-t border-orange-500/30 ">
                  <td className="px-4 py-3">{student.nome}</td>
                  {ACTIVITIES.map((activity) => {
                    const grade = studentGrades.find(
                      (g) => g.activity === activity,
                    );
                    return (
                      <td
                        key={`${student.id}-${activity}`}
                        className="px-4 py-3 text-center"
                      >
                        {grade ? grade.grade.toFixed(1) : "-"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {ACTIVITIES.map((activity) => {
                        const grade = studentGrades.find(
                          (g) => g.activity === activity,
                        );
                        return grade ? (
                          <Button
                            key={`${student.id}-${activity}-edit`}
                            size="sm"
                            variant="secondary"
                            className="text-green-400 hover:text-green-500 cursor-pointer transition-all"
                            onClick={() => onEdit(grade)}
                          >
                            Editar {activityLabels[activity]}
                          </Button>
                        ) : (
                          <Button
                            key={`${student.id}-${activity}-add`}
                            size="sm"
                            className="bg-orange-500/70 hover:bg-orange-600/70 text-white cursor-pointer transition-all"
                            onClick={() => onAdd(student, activity)}
                          >
                            Adicionar {activityLabels[activity]}
                          </Button>
                        );
                      })}
                    </div>
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
          return (
            <div
              key={student.id}
              className="bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
            >
              <p className="font-semibold text-orange-500 mb-2">
                {student.nome}
              </p>
              <div className="flex flex-col gap-2">
                {ACTIVITIES.map((activity) => {
                  const grade = studentGrades.find(
                    (g) => g.activity === activity,
                  );
                  return (
                    <div
                      key={`${student.id}-${activity}`}
                      className="flex justify-between items-center bg-[#121212b0] p-2 rounded-md"
                    >
                      <span className="capitalize">
                        {activityLabels[activity]}
                      </span>
                      {grade ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-green-400 hover:text-green-500 cursor-pointer transition-all"
                          onClick={() => onEdit(grade)}
                        >
                          {`${grade.grade.toFixed(1)} - Editar`}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-orange-500/70 hover:bg-orange-600/70 text-white cursor-pointer transition-all"
                          onClick={() => onAdd(student, activity)}
                        >
                          Adicionar
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
