import apiSpring from "./clientSpring";
import { Grade, CreateGradeDTO } from "@/types/Grade";

export const getGrades = async (): Promise<Grade[]> => {
  const response = await apiSpring.get("/grade");
  return response.data;
};

export const createGrade = async (data: CreateGradeDTO) => {
  const response = await apiSpring.post("/grade", data);
  return response.data;
};

export const updateGrade = async (id: string, data: CreateGradeDTO) => {
  const response = await apiSpring.put(`/grade/${id}`, data);
  return response.data;
};

export const deleteGrade = async (id: string) => {
  const response = await apiSpring.delete(`/grade/${id}`);
  return response.data;
};
