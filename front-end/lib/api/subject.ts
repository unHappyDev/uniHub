import apiSpring from "./clientSpring";
import { CreateSubjectDTO } from "@/types/Subject";

export const getSubjects = async () => {
  const response = await apiSpring.get("/subject");
  return response.data;
};

export const createSubject = async (subject: CreateSubjectDTO) => {
  const response = await apiSpring.post("/subject", subject);
  return response.data;
};

export const updateSubject = async (id: string, subject: CreateSubjectDTO) => {
  const response = await apiSpring.put(`/subject/${id}`, subject);
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await apiSpring.delete(`/subject/${id}`);
  return response.data;
};
