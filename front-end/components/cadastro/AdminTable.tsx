"use client";

import { Pencil, Trash2, Shield } from "lucide-react";

interface AdminTableProps {
  admins: any[];
  onEdit: (admin: any) => void;
  onDelete: (id: string) => void;
}

export default function AdminTable({ admins, onEdit, onDelete }: AdminTableProps) {
  return (
    <div className="mt-6">
      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left whitespace-nowrap">Nome</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Função</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>

          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhum admin cadastrado
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-orange-500/30 transition"
                >
                  <td className="px-4 py-3">{a.nome}</td>
                  <td className="px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Shield size={14} className="text-orange-400" />
                    {a.role ?? "ADMIN"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(a)}
                        className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="text-red-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={16} /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex flex-col gap-6">
        {admins.length === 0 ? (
          <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 shadow-glow">
            Nenhum admin cadastrado
          </div>
        ) : (
          admins.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-7 text-gray-200 shadow-glow transition-all hover:shadow-orange-500/30"
            >
              <p>
                <span className="font-semibold text-orange-500">Nome:</span>{" "}
                {a.nome}
              </p>

              <p>
                <span className="font-semibold text-orange-500">Email:</span>{" "}
                {a.email}
              </p>

              <p className="flex items-center gap-1">
                <span className="font-semibold text-orange-500">Função:</span>
                <Shield size={14} className="text-orange-400" />{" "}
                {a.role ?? "ADMIN"}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(a)}
                  className="text-green-400 hover:text-green-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={16} /> Editar
                </button>

                <button
                  onClick={() => onDelete(a.id)}
                  className="text-red-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
