"use client";

import { Grade, CreateGradeDTO } from "@/types/Grade";
import { Button } from "@/components/ui/button";

const ACTIVITIES = ["prova", "trabalho", "recuperacao", "extra"] as const;

interface SimpleStudent {
  id: string;
  nome: string;
}

interface Props {
  students: SimpleStudent[];
  grades: Grade[];
  classroomId: string;
  onEdit: (grade: Grade) => void;
  onAdd: (data: CreateGradeDTO) => void;
}

export default function GradeTable({
  students,
  grades,
  classroomId,
  onEdit,
  onAdd,
}: Props) {
  return (
    <table className="w-full border rounded text-white">
      <thead>
        <tr className="bg-gray-800">
          <th className="p-2 text-left">Aluno</th>

          {ACTIVITIES.map((a) => (
            <th key={`header-${a}`} className="p-2 text-left uppercase">
              {a}
            </th>
          ))}

          <th className="p-2 text-left">Ações</th>
        </tr>
      </thead>

      <tbody>
        {students.map((student, index) => {
          const studentGrades = grades.filter(
            (g) => g.studentId === student.id
          );

          return (
            <tr
              key={`${student.id}-${index}`}
              className="border-b border-gray-700"
            >
              <td className="p-2">{student.nome}</td>

              {ACTIVITIES.map((activity) => {
                const grade = studentGrades.find(
                  (g) => g.activity === activity
                );

                return (
                  <td
                    key={`${student.id}-${activity}`}
                    className="p-2 text-center"
                  >
                    {grade ? grade.grade : "-"}
                  </td>
                );
              })}

              <td className="p-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (studentGrades.length > 0) {
                        onEdit(studentGrades[0]);
                      } else {
                        onAdd({
                          studentId: student.id,
                          subject: "",
                          classroomId,
                          activity: ACTIVITIES[0],
                          grade: 0,
                        });
                      }
                    }}
                  >
                    {studentGrades.length > 0
                      ? "Editar Notas"
                      : "Adicionar Nota"}
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
