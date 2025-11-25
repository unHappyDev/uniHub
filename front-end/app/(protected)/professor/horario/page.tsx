"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getHorariosDoProfessor, HorarioDTO } from "@/lib/api/horario";
import ProfessorHorarioTable from "@/components/cadastro/ProfessorHorarioTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfessorSchedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const professorId = String(id);

  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState<"manhã" | "noite">(
    "manhã",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHorariosDoProfessor(professorId);
        setHorarios(dados);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setHorarios([]);
        } else {
          console.error(err);
          toast.error("Erro ao carregar horários do professor.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [professorId]);

  const horariosFiltrados = horarios.filter((h) => {
    const hora = Number(h.startAt.split(":")[0]);
    if (filtroPeriodo === "manhã") return hora < 12;
    if (filtroPeriodo === "noite") return hora >= 17;
    return true;
  });

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="flex items-center justify-between mb-10">
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
          <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/20 py-3 text-white cursor-pointer rounded-xl shadow-inner focus:ring-2 focus:ring-orange-500/40 transition-all">
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
        {loading ? (
          <p className="text-center text-orange-200">Carregando horários...</p>
        ) : horariosFiltrados.length === 0 ? (
          <p className="text-center text-orange-200">
            Nenhum horário cadastrado para este período.
          </p>
        ) : (
          <ProfessorHorarioTable
            horarios={horariosFiltrados}
            filtroPeriodo={filtroPeriodo}
          />
        )}
      </div>
    </div>
  );
}
