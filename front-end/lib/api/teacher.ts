import { CreateTeacherDTO, Teacher } from "@/types/Teacher";
import apiSpring from "./clientSpring";

export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await apiSpring.get("/professor");
  return response.data;
};

export const createTeacher = async (teacher: CreateTeacherDTO): Promise<void> => {
  await apiSpring.post("/professor", teacher);
};

export const updateTeacher = async (id: string, teacher: CreateTeacherDTO): Promise<void> => {
  await apiSpring.put(`/professor/${id}`, teacher);
};

export const deleteTeacher = async (id: string): Promise<void> => {
  await apiSpring.delete(`/professor/${id}`);
};
