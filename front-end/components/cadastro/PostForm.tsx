"use client";

import { useEffect, useState } from "react";
import { CreatePostDTO, Post } from "@/types/Post";
import { toast } from "sonner";

interface PostFormProps {
  onAdd: (data: CreatePostDTO) => Promise<void>;
  onEdit: (data: Post) => Promise<void>;
  editingPost: Post | null;
}

export default function PostForm({ onAdd, onEdit, editingPost }: PostFormProps) {
  const [formData, setFormData] = useState<CreatePostDTO>({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        body: editingPost.body,
      });
    } else {
      setFormData({ title: "", body: "" });
    }
  }, [editingPost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.body) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    try {
      if (editingPost) {
        await onEdit({ ...editingPost, ...formData });
      } else {
        await onAdd(formData);
      }
      setFormData({ title: "", body: "" });
    } catch (error) {
      console.error("Erro ao salvar post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white">
      <div>
        <label className="block text-sm mb-1 uppercase">Título</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 transition-all text-white px-5 py-3 rounded-xl shadow-inner"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 uppercase">Conteúdo</label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-[#1a1a1dc3] border border-orange-400/40 focus:ring-2 focus:ring-orange-500/40 transition-all text-white px-5 py-3 rounded-xl shadow-inner resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-6 py-3 rounded-xl transition-all uppercase cursor-pointer"
      >
        {editingPost ? "Salvar Alterações" : "Criar Post"}
      </button>
    </form>
  );
}
