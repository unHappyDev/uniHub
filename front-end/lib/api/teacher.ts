import { CreateTeacherDTO, Teacher } from "@/types/Teacher";
import apiSpring from "./clientSpring";

export async function getTeachers(): Promise<Teacher[]> {
  const response = await apiSpring.get("/professor");
  return response.data;
}

export async function createTeacher(teacher: CreateTeacherDTO): Promise<void> {
  await apiSpring.post("/professor", teacher);
}

export async function updateTeacher(id: string, teacher: CreateTeacherDTO): Promise<void> {
  await apiSpring.put(`/professor/${id}`, teacher);
}

export async function deleteTeacher(id: string): Promise<void> {
  await apiSpring.delete(`/professor/${id}`);
}
