"use client";

import { Grade } from "@/types/Grade";
import { Button } from "@/components/ui/button";

interface Props {
  grades: Grade[];
  onEdit: (grade: Grade) => void;
  onDelete: (id: string) => void;
}

export default function GradeTable({ grades, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border rounded">
      <thead className="bg-gray">
        <tr>
          <th className="p-2 text-left">Aluno</th>
          <th className="p-2 text-left">Matéria</th>
          <th className="p-2 text-left">Nota</th>
          <th className="p-2 text-left">Ações</th>
        </tr>
      </thead>

      <tbody>
        {grades.map((grade) => (
          <tr key={grade.id} className="border-b">
            <td className="p-2">{grade.student}</td>
            <td className="p-2">{grade.subject}</td>
            <td className="p-2">{grade.grade}</td>

            <td className="p-2 flex gap-2">

              <Button size="sm" onClick={() => onEdit(grade)}>
                Editar
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(grade.id)}
              >
                Excluir
              </Button>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
