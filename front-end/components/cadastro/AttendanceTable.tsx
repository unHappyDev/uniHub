"use client";

import { Attendance } from "@/types/Attendance";
import { Button } from "@/components/ui/button";

interface Props {
  data: Attendance[];
  onEdit: (attendance: Attendance) => void;
  onDelete: (id: string) => void;
}

export default function AttendanceTable({ data, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border">
      <thead className="bg-muted">
        <tr>
          <th className="p-2 text-left">Aluno</th>
          <th className="p-2 text-left">Matéria</th>
          <th className="p-2">Data</th>
          <th className="p-2">Presença</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((att) => (
          <tr key={att.id} className="border-t">
            <td className="p-2">{att.username}</td>
            <td className="p-2">{att.subjectName}</td>
            <td className="p-2">{new Date(att.attendanceDate).toLocaleString()}</td>
            <td className="p-2">{att.presence ? "✅" : "❌"}</td>
            <td className="p-2 flex gap-2 justify-center">
              <Button className="cursor-pointer" size="sm" onClick={() => onEdit(att)}>Editar</Button>
              <Button className="cursor-pointer" variant="destructive" size="sm" onClick={() => onDelete(att.id)}>
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
