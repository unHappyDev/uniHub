"use client";

import { Grade } from "@/types/Grade";
import { Button } from "@/components/ui/button";

const ACTIVITIES = ["prova", "trabalho", "recuperacao", "extra"] as const;
type Activity = (typeof ACTIVITIES)[number];

interface Student {
  id: string;
  nome: string;
}

interface Props {
  students: Student[];
  grades: Grade[];
  classroomId: string;
  onEdit: (grade: Grade) => void;
  onAdd: (grade: Grade) => void;
}

export default function GradeTable({
  students,
  grades,
  classroomId,
  onEdit,
  onAdd,
}: Props) {
  return (
    <table className="w-full border rounded">
      <thead>
        <tr>
          <th className="p-2 text-left">Aluno</th>

          {ACTIVITIES.map((a) => (
            <th key={a} className="p-2 text-left uppercase">
              {a}
            </th>
          ))}

          <th className="p-2">Ações</th>
        </tr>
      </thead>

      <tbody>
        {students.map((s) => {
          const studentGrades = grades.filter(
            (g) => String(g.studentId) === String(s.id)
          );

          return (
            <tr key={s.id} className="border-b">
              <td className="p-2">{s.nome}</td>

              {ACTIVITIES.map((activity) => {
                const g = studentGrades.find((x) => x.activity === activity);
                return (
                  <td key={activity} className="p-2 text-center">
                    {g ? g.grade : "-"}
                  </td>
                );
              })}

              <td className="p-2 flex gap-2 flex-wrap">
                {ACTIVITIES.map((activity) => {
                  const g = studentGrades.find((x) => x.activity === activity);

                  if (g) {
                    return (
                      <Button key={activity} size="sm" onClick={() => onEdit(g)}>
                        Editar {activity}
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={activity}
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onAdd({
                          id: "", // será gerado pelo backend
                          studentId: s.id,
                          classroomId,
                          activity,
                          grade: 0,
                        } as Grade)
                      }
                    >
                      Adicionar {activity}
                    </Button>
                  );
                })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
