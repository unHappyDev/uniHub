"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/lib/api/post";
import { Post } from "@/types/Post";

export default function Avisos() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  async function fetchPosts() {
    try {
      const data = await getPosts();
      setPosts(data ?? []);
    } catch (err: any) {
      
      if (err?.response?.status === 404) {
        setPosts([]);
      } else {
        setError("Erro ao carregar os avisos");
      }
    } finally {
      setLoading(false);
    }
  }

  fetchPosts();
}, []);

  if (loading) return <p className="text-center text-gray-400 mt-10">Carregando avisos...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (posts.length === 0) return <p className="text-center text-gray-400 mt-10">Nenhum aviso encontrado.</p>;

  return (
    <div className="p-8 flex flex-col min-h-screen max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-300/90 mb-8 text-center uppercase tracking-wide">
        Avisos
      </h1>

      <div className="w-full bg-[#1a1a1dc3] border border-orange-400/40 rounded-2xl p-6 shadow-glow transition-all">
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.postId}
              className="bg-[#222222c0] border border-orange-400/30 rounded-2xl p-4"
            >
              <h2 className="text-xl font-semibold text-orange-300/90 mb-2 uppercase tracking-wide">
                {post.title}
              </h2>

              <p className="text-gray-200 dark:text-gray-300 mb-6">
                {post.body}
              </p>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Por: {post.owner}</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
