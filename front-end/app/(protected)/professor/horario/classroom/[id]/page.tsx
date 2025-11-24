"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getHorariosDoProfessor, HorarioDTO } from "@/lib/api/horario";
import ProfessorHorarioTable from "@/components/cadastro/ProfessorHorarioTable";

export default function ProfessorSchedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const professorId = String(id);

  // Log para verificar o id da página e o professorId
  console.log("ID da Página:", id);  // Verifique o id extraído da URL
  console.log("Professor ID:", professorId);  // Verifique o professorId convertido para string

  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState<"manhã" | "noite">("manhã");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHorariosDoProfessor(professorId);
        setHorarios(dados);
        console.log("Horários do professor:", dados); // Logando os dados recebidos
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar horários do professor.");
      }
    }

    carregar();
  }, [professorId]);

  // Verificando a filtragem de horários
  const horariosFiltrados = horarios.filter((h) => {
    const hora = Number(h.startAt.substring(0, 2));
    console.log("Hora:", hora, "Filtro Periodo:", filtroPeriodo); // Log da hora e filtro
    if (filtroPeriodo === "manhã") return hora < 12;
    if (filtroPeriodo === "noite") return hora >= 17;
    return true;
  });

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      {/* BOTÃO VOLTAR */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white font-semibold w-max transition-colors cursor-pointer"
      >
        Voltar
      </button>

      {/* TÍTULO */}
      <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center mb-10">
        Horários do Professor
      </h1>

      {/* CARD DO FILTRO */}
      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <label className="block mb-2 text-orange-200 font-semibold uppercase tracking-wide">
          Filtrar por período:
        </label>

        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value as any)}
          className="w-full bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 
          transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
        >
          <option value="manhã">Manhã</option>
          <option value="noite">Noite</option>
        </select>
      </div>

      {/* TABELA */}
      <div className="bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow overflow-auto">
        <ProfessorHorarioTable
          horarios={horariosFiltrados}
          filtroPeriodo={filtroPeriodo}
        />
      </div>
    </div>
  );
}
