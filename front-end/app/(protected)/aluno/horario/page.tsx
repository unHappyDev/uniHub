"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getHorariosDoEstudante, HorarioDTO } from "@/lib/api/horario"; // API para estudante
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AlunoHorarioTable from "@/components/cadastro/AlunoHorarioTable";

export default function EstudanteSchedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const estudanteId = String(id);

  console.log("ID da Página:", id); 
  console.log("Estudante ID:", estudanteId);

  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState<"manhã" | "noite">("manhã");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHorariosDoEstudante(estudanteId);
        setHorarios(dados);
        console.log("Horários do estudante:", dados);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar horários do estudante.");
      }
    }

    carregar();
  }, [estudanteId]);

  const horariosFiltrados = horarios.filter((h) => {
    const hora = Number(h.startAt.split(":")[0]);
    console.log("Hora extraída:", hora, "Filtro:", filtroPeriodo);

    if (filtroPeriodo === "manhã") return hora < 12;
    if (filtroPeriodo === "noite") return hora >= 17;
    return true;
  });

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
   
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.back()}
          className="hidden md:block px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white font-semibold w-max transition-colors cursor-pointer"
        >
          Voltar
        </button>

        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center flex-1 ml-6">
          Meu Horário
        </h1>
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-6 shadow-glow transition-all hover:shadow-orange-500/30">
        <label className="block mb-2 text-orange-200 font-semibold uppercase tracking-wide">
          Filtrar por período:
        </label>

        <Select
          value={filtroPeriodo}
          onValueChange={(value) =>
            setFiltroPeriodo(value as "manhã" | "noite")
          }
        >
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/20 py-3 text-white cursor-pointer rounded-xl shadow-inner cursor-pointer focus:ring-2 focus:ring-orange-500/40 transition-all">
            <SelectValue placeholder="Selecione um período" />
          </SelectTrigger>
          <SelectContent className="bg-[#151a1b] text-white">
            <SelectItem value="manhã" className="cursor-pointer">
              Manhã
            </SelectItem>
            <SelectItem value="noite" className="cursor-pointer">
              Noite
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-glass border border-orange-400/40 rounded-2xl p-4 shadow-glow overflow-auto">
        <AlunoHorarioTable
          horarios={horariosFiltrados}
          filtroPeriodo={filtroPeriodo}
        />
      </div>
    </div>
  );
}
