"use client";

import { useEffect, useState } from "react";
import { Post, CreatePostDTO } from "@/types/Post";
import PostForm from "@/components/cadastro/PostForm";
import PostTable from "@/components/cadastro/PostTable";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api/post";

function handleApiError(error: any, action: string) {

  console.warn(`Erro ao ${action} post:`, error?.response?.data || error);

  if (error.response?.status === 403) {
    toast.error(`Você não tem permissão para ${action} este post.`);
  } else if (error.response?.status === 401) {
    toast.error("Sessão expirada. Faça login novamente.");
  } else {
    toast.error(`Erro ao ${action} post.`);
  }

  return;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPosts([]);
      } else {
        handleApiError(error, "buscar");
      }
    }
  };

  const handleAdd = async (post: CreatePostDTO) => {
    try {
      await createPost(post);
      await fetchPosts();
      setIsModalOpen(false);
      toast.success("Post criado com sucesso!");
    } catch (error: any) {
      handleApiError(error, "criar");
      return;
    }
  };

  const handleUpdate = async (post: Post) => {
    if (!post.postId) return;
    try {
      await updatePost(post.postId, { title: post.title, body: post.body });
      await fetchPosts();
      setIsModalOpen(false);
      toast.success("Post atualizado com sucesso!");
    } catch (error: any) {
      handleApiError(error, "editar");
      return;
    }
  };

  const confirmDeletePost = (id: string) => {
    toast.custom((t) => (
      <div className="bg-[#1a1a1d] border border-orange-400/40 text-white p-4 rounded-xl shadow-md">
        <p className="font-semibold mb-2">Excluir post?</p>
        <p className="text-sm text-gray-300 mb-4">
          Essa ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                await deletePost(id);
                toast.dismiss(t);
                toast.success("Post excluído com sucesso!");
                await fetchPosts();
              } catch (error: any) {
                toast.dismiss(t);
                handleApiError(error, "excluir");
                return;
              }
            }}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm"
          >
            Excluir
          </button>
        </div>
      </div>
    ));
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleView = (post: Post) => {
    setViewingPost(post);
  };

  const closeModal = () => {
    setEditingPost(null);
    setIsModalOpen(false);
  };

  const closeViewModal = () => {
    setViewingPost(null);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesTitle = p.title?.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesAuthor =
      p.owner?.toLowerCase().includes(filterAuthor.toLowerCase()) ?? false;
    return matchesTitle && matchesAuthor;
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-medium mb-8 text-center uppercase">
          Gerenciamento de Posts
        </h1>

        <div className="bg-glass border border-orange-400/40 rounded-2xl p-6 mb-10 shadow-glow transition-all hover:shadow-orange-500/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder=" Filtrar por título..."
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <input
              type="text"
              placeholder=" Filtrar por autor..."
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-2.5 rounded-xl outline-none shadow-inner"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all uppercase cursor-pointer"
            >
              + Criar Post
            </button>
          </div>
        </div>

        <PostTable
          posts={filteredPosts}
          onDelete={confirmDeletePost}
          onEdit={handleEdit}
          onView={handleView}
        />

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
            {editingPost ? "Editar Post" : "Novo Post"}
          </h2>
          <PostForm onAdd={handleAdd} onEdit={handleUpdate} editingPost={editingPost} />
        </Modal>

        {viewingPost && (
          <Modal isOpen={!!viewingPost} onClose={closeViewModal}>
            <div className="text-white max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-orange-400 mb-2 text-center">
                {viewingPost.title}
              </h2>
              <p className="text-sm text-gray-400 text-center mb-6">
                Por {viewingPost.owner ?? "—"} em{" "}
                {new Date(viewingPost.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <div className="bg-[#121212b0] border border-orange-400/20 rounded-xl p-5 text-gray-200 whitespace-pre-line leading-relaxed">
                {viewingPost.body || "Sem conteúdo disponível."}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
