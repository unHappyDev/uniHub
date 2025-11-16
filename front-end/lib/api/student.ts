import { CreateStudentDTO } from "@/types/Student";
import apiSpring from "./clientSpring";

export const getStudents = async () => {
  const response = await apiSpring.get("/student");
  return response.data;
};

export const createStudent = async (student: CreateStudentDTO) => {
  console.log(" Enviando aluno ao backend:", student);
  const response = await apiSpring.post("/student", student);
  return response.data;
};

export const updateStudent = async (id: string, student: any) => {
  const response = await apiSpring.put(`/student/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  const response = await apiSpring.delete(`/student/${id}`);
  return response.data;
};
