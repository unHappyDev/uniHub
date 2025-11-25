"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChamadaDTO, getChamadaDoEstudante } from "@/lib/api/attendance";
import { getNotasDoEstudante, NotaDTO } from "@/lib/api/grade";
import { getClassroomsByLoggedStudent } from "@/lib/api/classroom";
import AlunoNotasChamadaTable from "@/components/cadastro/AlunoTable";

export default function EstudanteNotasPage() {
  const [notas, setNotas] = useState<NotaDTO[]>([]);
  const [chamada, setChamada] = useState<ChamadaDTO[]>([]);
  const [filtroMateria, setFiltroMateria] = useState<string>("");
  const [materiasDoAluno, setMateriasDoAluno] = useState<string[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const minhasNotas = await getNotasDoEstudante();
        const minhaChamada = await getChamadaDoEstudante();

        setNotas(minhasNotas);
        setChamada(minhaChamada);

        const turmas = await getClassroomsByLoggedStudent();
        const todasMaterias = turmas.map((t) => t.subject);
        setMateriasDoAluno(todasMaterias);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar notas, presença ou matérias.");
      }
    }

    carregarDados();
  }, []);

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-2xl font-semibold text-orange-300 mb-6 text-center">
        Minhas Notas e Faltas
      </h1>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow overflow-auto">
        <AlunoNotasChamadaTable
          notas={notas}
          chamada={chamada}
          materiasDoAluno={materiasDoAluno}
          filtroMateria={filtroMateria}
        />
      </div>
    </div>
  );
}
