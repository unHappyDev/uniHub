
import { CreateTeacherDTO, Teacher } from "@/types/Teacher";
import apiSpring from "./client";

//  Buscar todos os professores
export async function getTeachers(): Promise<Teacher[]> {
  const response = await apiSpring.get("/professor");
  return response.data;
}

// Criar um novo professor
export async function createTeacher(teacher: CreateTeacherDTO): Promise<void> {
  await apiSpring.post("/professor", teacher);
}

// Atualizar um professor
export async function updateTeacher(id: string, teacher: CreateTeacherDTO): Promise<void> {
  await apiSpring.put(`/professor/${id}`, teacher);
}

//  Deletar professor
export async function deleteTeacher(id: string): Promise<void> {
  await apiSpring.delete(`/professor/${id}`);
}
