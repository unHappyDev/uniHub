import apiSpring from "./clientSpring";
import { Post, CreatePostDTO } from "@/types/Post";

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiSpring.get("/post");
  return response.data;
};

export const createPost = async (data: CreatePostDTO) => {
  await apiSpring.post("/post", data);
};

export const updatePost = async (id: string, data: CreatePostDTO) => {
  await apiSpring.put(`/post/${id}`, data);
};

export const deletePost = async (id: string) => {
  await apiSpring.delete(`/post/${id}`);
};
