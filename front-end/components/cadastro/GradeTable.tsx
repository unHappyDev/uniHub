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
      <thead>
        <tr>
          <th className="p-2 text-left">Aluno</th>
          <th className="p-2 text-left">Matéria</th>
          <th className="p-2 text-left">Nota</th>
          <th className="p-2 text-left">Ações</th>
        </tr>
      </thead>

      <tbody>
        {grades.map((g) => (
          <tr key={g.id} className="border-b">
            <td className="p-2">{g.student}</td>
            <td className="p-2">{g.subject}</td>
            <td className="p-2">{g.grade}</td>

            <td className="p-2 flex gap-2">
              <Button size="sm" onClick={() => onEdit(g)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(g.id)}>
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
