"use client";

import { Post } from "@/types/Post";

interface PostTableProps {
  posts: Post[];
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (post: Post) => void;
  onView: (post: Post) => void;
}

export default function PostTable({
  posts,
  onDelete,
  onEdit,
  onView,
}: PostTableProps) {
  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
        <table className="min-w-full rounded-xl text-white">
          <thead>
            <tr className="text-orange-400 uppercase text-sm">
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Autor</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400 bg-neutral-900"
                >
                  Nenhum post encontrado
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr
                  key={p.postId}
                  onClick={() => onView(p)} 
                  className="border-t border-orange-500/30 transition hover:bg-neutral-900 cursor-pointer"
                >
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3">{p.owner ?? "—"}</td>
                  <td className="px-4 py-3">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(p);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.postId) onDelete(p.postId);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-6">
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow">
            Nenhum post encontrado
          </div>
        ) : (
          posts.map((p) => (
            <div
              key={p.postId}
              onClick={() => onView(p)}
              className="flex flex-col gap-2 bg-glass border border-orange-400/40 rounded-2xl p-7 text-gray-200 shadow-glow transition-all hover:shadow-orange-500/30 cursor-pointer"
            >
              <p>
                <span className="font-semibold text-orange-500">Título:</span>{" "}
                {p.title}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Autor:</span>{" "}
                {p.owner ?? "—"}
              </p>
              <p>
                <span className="font-semibold text-orange-500">Data:</span>{" "}
                {new Date(p.createdAt).toLocaleDateString("pt-BR")}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(p);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (p.postId) onDelete(p.postId);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
