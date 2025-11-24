"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChamadaDTO, getChamadaDoEstudante } from "@/lib/api/attendance";
import { getNotasDoEstudante, NotaDTO } from "@/lib/api/grade";
import AlunoNotasChamadaTable from "@/components/cadastro/AlunoTable";

export default function EstudanteNotasPage() {
  const [notas, setNotas] = useState<NotaDTO[]>([]);
  const [chamada, setChamada] = useState<ChamadaDTO[]>([]);
  const [filtroMateria, setFiltroMateria] = useState<string>("");

  useEffect(() => {
    async function carregarDados() {
      try {
        // API já retorna apenas os dados do aluno logado
        const minhasNotas = await getNotasDoEstudante();
        const minhaChamada = await getChamadaDoEstudante();

        setNotas(minhasNotas);
        setChamada(minhaChamada);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar notas ou presença.");
      }
    }

    carregarDados();
  }, []);

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-2xl font-semibold text-orange-300 mb-6">
        Minhas Notas e Faltas
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por matéria"
          className="p-2 rounded-lg bg-[#1a1a1d] border border-orange-400/20 text-white"
          value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value)}
        />
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow overflow-auto">
        <AlunoNotasChamadaTable
          notas={notas}
          chamada={chamada}
          filtroMateria={filtroMateria}
        />
      </div>
    </div>
  );
}
