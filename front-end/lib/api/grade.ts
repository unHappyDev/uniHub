import apiSpring from "./clientSpring";
import { Grade, CreateGradeDTO } from "@/types/Grade";

export const getGrades = async (): Promise<Grade[]> => {
  const response = await apiSpring.get("/grade");
  return response.data;
};

// Filtra as notas de uma turma específica
export const getGradesByClassroom = async (classroomId: string): Promise<Grade[]> => {
  const all = await getGrades();
  return all.filter(g => g.classroomId === classroomId);
};

export const createGrade = async (data: CreateGradeDTO) => {
  return apiSpring.post("/grade", data);
};

export const updateGrade = async (id: string, data: CreateGradeDTO) => {
  return apiSpring.put(`/grade/${id}`, data);
};

export const deleteGrade = async (id: string) => {
  return apiSpring.delete(`/grade/${id}`);
};
