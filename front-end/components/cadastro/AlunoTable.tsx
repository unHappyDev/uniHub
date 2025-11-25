"use client";

import React, { useState } from "react";
import { NotaDTO } from "@/lib/api/grade";
import { ChamadaDTO } from "@/lib/api/attendance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  notas: NotaDTO[];
  chamada: ChamadaDTO[];
  materiasDoAluno?: string[]; 
  filtroMateria?: string;
}

export default function AlunoNotasChamadaTable({
  notas,
  chamada,
  materiasDoAluno,
  filtroMateria,
}: Props) {
  const [modalAberto, setModalAberto] = useState(false);
  const [faltasSelecionadas, setFaltasSelecionadas] = useState<ChamadaDTO[]>(
    [],
  );
  const [materiaSelecionada, setMateriaSelecionada] = useState("");

  const notasNormalizadas = notas.map((n) => ({
    ...n,
    activity: n.activity.toLowerCase(),
  }));

  const materias = Array.from(
    new Set([
      ...(materiasDoAluno ?? []),
      ...notasNormalizadas.map((n) => n.subject),
      ...chamada.map((c) => c.subjectName),
    ]),
  ).filter(Boolean);

  let materiasFiltradas = filtroMateria
    ? materias.filter((m) =>
        m.toLowerCase().includes(filtroMateria.toLowerCase()),
      )
    : materias;

  materiasFiltradas = materiasFiltradas.sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

  const columns = [
    { activity: "prova", bimester: 1 },
    { activity: "recuperacao", bimester: 1 },
    { activity: "trabalho", bimester: 1 },
    { activity: "prova", bimester: 2 },
    { activity: "recuperacao", bimester: 2 },
    { activity: "trabalho", bimester: 2 },
    { activity: "extra" },
  ];

  const label = {
    prova: "Prova",
    trabalho: "Trabalho",
    recuperacao: "Recuperação",
    extra: "Extra",
  };

  const formatarNota = (valor: number | null | undefined) => {
    if (valor === null || valor === undefined || isNaN(valor)) return "—";
    return valor.toFixed(1);
  };

  const totalFaltas = (materia: string) =>
    chamada.filter((c) => c.subjectName === materia && !c.presence).length;

  const abrirDetalhes = (materia: string) => {
    const faltas = chamada.filter(
      (c) => c.subjectName === materia && !c.presence,
    );
    setFaltasSelecionadas(faltas);
    setMateriaSelecionada(materia);
    setModalAberto(true);
  };

  const calcularMb = (notasMateria: NotaDTO[], b: number) => {
    const provas = notasMateria.filter(
      (n) =>
        n.bimester === b &&
        (n.activity === "prova" || n.activity === "recuperacao"),
    );
    const trabalhos = notasMateria.filter(
      (n) => n.bimester === b && n.activity === "trabalho",
    );
    const extra = notasMateria.filter((n) => n.activity === "extra");

    const maiorProva =
      provas.length > 0 ? Math.max(...provas.map((n) => Number(n.grade))) : 0;
    const somaTrabalho = trabalhos.reduce((acc, n) => acc + Number(n.grade), 0);
    const bonusExtra = extra.reduce((a, b) => a + Number(b.grade), 0) / 2;

    return Number((maiorProva + somaTrabalho + bonusExtra).toFixed(1));
  };

  const corMedia = (valor: number | null) => {
    if (valor === null) return "text-gray-400";
    if (valor >= 7) return "text-green-400 font-bold";
    if (valor >= 5) return "text-yellow-400 font-bold";
    return "text-red-400 font-bold";
  };

  const bimestreCompleto = (notasMateria: NotaDTO[], b: number) => {
    const temProvaOuRec = notasMateria.some(
      (n) =>
        n.bimester === b &&
        (n.activity === "prova" || n.activity === "recuperacao"),
    );
    const temTrabalho = notasMateria.some(
      (n) => n.bimester === b && n.activity === "trabalho",
    );
    return temProvaOuRec && temTrabalho;
  };

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
        <table className="min-w-full text-white rounded-xl">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Matéria</th>
              {columns.map((c, i) => (
                <th key={i} className="px-4 py-3 text-center">
                  {c.activity === "extra"
                    ? "Extra"
                    : `${label[c.activity as keyof typeof label]} B${c.bimester}`}
                </th>
              ))}
              <th className="px-4 py-3 text-center">MB1</th>
              <th className="px-4 py-3 text-center">MB2</th>
              <th className="px-4 py-3 text-center">Média</th>
              <th className="px-4 py-3 text-center">Faltas</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {materiasFiltradas.map((materia) => {
              const notasMateria = notasNormalizadas.filter(
                (n) => n.subject === materia,
              );
              const mb1 = calcularMb(notasMateria, 1);
              const mb2 = calcularMb(notasMateria, 2);
              const mediaTotal =
                bimestreCompleto(notasMateria, 1) &&
                bimestreCompleto(notasMateria, 2)
                  ? Number(((mb1 + mb2) / 2).toFixed(1))
                  : null;

              return (
                <tr key={materia} className="border-t border-orange-500/30">
                  <td className="px-4 py-3">{materia}</td>
                  {columns.map((col, idx) => {
                    const nota = notasMateria.find(
                      (n) =>
                        n.activity === col.activity &&
                        (col.bimester ? n.bimester === col.bimester : true),
                    );
                    return (
                      <td key={idx} className="px-4 py-3 text-center">
                        {nota ? Number(nota.grade).toFixed(1) : "—"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">{formatarNota(mb1)}</td>
                  <td className="px-4 py-3 text-center">{formatarNota(mb2)}</td>
                  <td
                    className={`px-4 py-3 text-center ${corMedia(mediaTotal)}`}
                  >
                    {formatarNota(mediaTotal)}
                  </td>
                  <td className="px-4 py-3 text-center text-red-400 font-semibold">
                    {totalFaltas(materia)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      className="bg-orange-500/70 hover:bg-orange-600/70 text-white cursor-pointer"
                      onClick={() => abrirDetalhes(materia)}
                    >
                      Ver Detalhes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow">
        <table className="min-w-max text-white table-auto">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-2">Matéria</th>
              {columns.map((c, i) => (
                <th key={i} className="px-4 py-2">
                  {c.activity === "extra"
                    ? "Extra"
                    : `${label[c.activity as keyof typeof label]} B${c.bimester}`}
                </th>
              ))}
              <th className="px-4 py-2">MB1</th>
              <th className="px-4 py-2">MB2</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Faltas</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {materiasFiltradas.map((materia) => {
              const notasMateria = notasNormalizadas.filter(
                (n) => n.subject === materia,
              );
              const mb1 = calcularMb(notasMateria, 1);
              const mb2 = calcularMb(notasMateria, 2);
              const mediaTotal =
                bimestreCompleto(notasMateria, 1) &&
                bimestreCompleto(notasMateria, 2)
                  ? Number(((mb1 + mb2) / 2).toFixed(1))
                  : null;

              return (
                <tr key={materia} className="bg-[#121212b0]">
                  <td className="px-4 py-2 font-semibold">{materia}</td>
                  {columns.map((col, idx) => {
                    const nota = notasMateria.find(
                      (n) =>
                        n.activity === col.activity &&
                        (col.bimester ? n.bimester === col.bimester : true),
                    );
                    return (
                      <td key={idx} className="px-4 py-2 text-center">
                        {nota ? Number(nota.grade).toFixed(1) : "—"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 text-center">{formatarNota(mb1)}</td>
                  <td className="px-4 py-2 text-center">{formatarNota(mb2)}</td>
                  <td
                    className={`px-4 py-2 text-center ${corMedia(mediaTotal)}`}
                  >
                    {formatarNota(mediaTotal)}
                  </td>
                  <td className="px-4 py-2 text-center text-red-500 font-bold">
                    {totalFaltas(materia)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      size="sm"
                      className="bg-orange-500/70 hover:bg-orange-600/80 text-white cursor-pointer"
                      onClick={() => abrirDetalhes(materia)}
                    >
                      Detalhes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="bg-[#1a1a1d] text-white border border-orange-400/30">
          <DialogHeader>
            <DialogTitle className="text-orange-300">
              Detalhes de Faltas — {materiaSelecionada}
            </DialogTitle>
          </DialogHeader>
          {faltasSelecionadas.length === 0 ? (
            <p className="text-center text-gray-400 mt-3">
              Nenhuma falta registrada.
            </p>
          ) : (
            <ul className="mt-3 space-y-4">
              {faltasSelecionadas.map((f, i) => (
                <li
                  key={i}
                  className="p-4 rounded-lg bg-black/30 border border-orange-400/20"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-orange-300 font-semibold">
                      Data:{" "}
                      {new Date(f.attendanceDate).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Dia da semana:{" "}
                      <span className="text-white">
                        {f.schedule?.dayOfWeek ?? "—"}
                      </span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      Horário:{" "}
                      <span className="text-white">
                        {f.schedule?.startAt ?? "??"} até{" "}
                        {f.schedule?.endAt ?? "??"}
                      </span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      Status:{" "}
                      <span className="text-red-400 font-semibold">Falta</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
