"use client";
import { Activity, Grade } from "@/types/Grade";
import { Button } from "@/components/ui/button";

const ACTIVITIES: Activity[] = [
  "prova",
  "trabalho",
  "recuperacao",
  "extra",
];

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
  // Ordena os alunos alfabeticamente
  const sortedStudents = [...students].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
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
                <th key={`header-${a}`} className="px-4 py-3 text-center uppercase">
                  {a}
                </th>
              ))}
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => {
              const studentGrades = grades.filter((g) => g.studentId === student.id);
              return (
                <tr key={student.id} className="border-t border-orange-500/30 transition hover:bg-[#1a1a1dc3]">
                  <td className="px-4 py-3">{student.nome}</td>
                  {ACTIVITIES.map((activity) => {
                    const grade = studentGrades.find((g) => g.activity === activity);
                    return (
                      <td key={`${student.id}-${activity}`} className="px-4 py-3 text-center">
                        {grade ? grade.grade : "-"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {ACTIVITIES.map((activity) => {
                        const grade = studentGrades.find((g) => g.activity === activity);
                        return grade ? (
                          <Button
                            key={`${student.id}-${activity}-edit`}
                            size="sm"
                            variant="secondary"
                            className="text-green-400 hover:text-green-500"
                            onClick={() => onEdit(grade)}
                          >
                            Editar {activity}
                          </Button>
                        ) : (
                          <Button
                            key={`${student.id}-${activity}-add`}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => onAdd(student, activity)}
                          >
                            Adicionar {activity}
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
          const studentGrades = grades.filter((g) => g.studentId === student.id);
          return (
            <div
              key={student.id}
              className="bg-glass border border-orange-400/40 rounded-2xl p-6 text-gray-200 shadow-glow transition hover:shadow-orange-500/30"
            >
              <p className="font-semibold text-orange-500 mb-2">{student.nome}</p>
              <div className="flex flex-col gap-2">
                {ACTIVITIES.map((activity) => {
                  const grade = studentGrades.find((g) => g.activity === activity);
                  return (
                    <div
                      key={`${student.id}-${activity}`}
                      className="flex justify-between items-center bg-[#121212b0] p-2 rounded-md"
                    >
                      <span className="capitalize">{activity}</span>
                      {grade ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-green-400 hover:text-green-500"
                          onClick={() => onEdit(grade)}
                        >
                          {grade.grade} - Editar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
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
