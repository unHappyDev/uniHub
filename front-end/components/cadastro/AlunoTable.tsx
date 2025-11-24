"use client";

import React from "react";
import { NotaDTO } from "@/lib/api/grade";
import { ChamadaDTO } from "@/lib/api/attendance";

interface Props {
  notas: NotaDTO[];
  chamada: ChamadaDTO[];
  filtroMateria?: string;
}

const AlunoNotasChamadaTable: React.FC<Props> = ({ notas, chamada, filtroMateria }) => {

  const notasFiltradas = filtroMateria
    ? notas.filter(n => n.subject === filtroMateria)
    : notas;

  const chamadaFiltrada = filtroMateria
    ? chamada.filter(c => c.subject === filtroMateria)
    : chamada;

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-white">
        <thead>
          <tr className="bg-orange-500/50">
            <th className="p-3 border border-orange-400/50">Matéria</th>
            <th className="p-3 border border-orange-400/50">Atividade</th>
            <th className="p-3 border border-orange-400/50">Nota</th>
            <th className="p-3 border border-orange-400/50">Data</th>
            <th className="p-3 border border-orange-400/50">Presença</th>
          </tr>
        </thead>
        <tbody>
          {notasFiltradas.map((n, index) => {
            const aula = chamadaFiltrada.find(c => c.subject === n.subject);
            return (
              <tr key={index} className="odd:bg-[#1a1a1d] even:bg-[#151a1b]">
                <td className="p-3 border border-orange-400/20">{n.subject}</td>
                <td className="p-3 border border-orange-400/20">{n.activity}</td>
                <td className="p-3 border border-orange-400/20">{n.grade ?? "N/A"}</td>
                <td className="p-3 border border-orange-400/20">{aula?.attendanceDate ?? "-"}</td>
                <td className="p-3 border border-orange-400/20">{aula?.presence ? "Presente" : "Faltou"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AlunoNotasChamadaTable;
