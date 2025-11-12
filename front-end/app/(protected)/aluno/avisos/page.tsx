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
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os avisos");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Carregando avisos...</p>;
  if (error) return <p>{error}</p>;
  if (posts.length === 0) return <p>Nenhum aviso encontrado.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Avisos</h1>

      {posts.map((post) => (
        <div
          key={post.postId}
          className="p-4 border rounded-xl shadow-sm bg-white dark:bg-neutral-900"
        >
          <h2 className="text-lg font-medium">{post.title}</h2>

          <p className="text-gray-700 dark:text-gray-300 mt-2">{post.body}</p>

          <div className="flex justify-between text-sm text-gray-500 mt-3">
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
  );
}
