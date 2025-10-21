import { CreateStudentDTO } from "@/types/Student";
import apiSpring from "./client";



//  Buscar todos os alunos
export const getStudents = async () => {
  const response = await apiSpring.get("/student");
  return response.data;
};

//  Criar aluno (enviando o JSON compatível com backend)
export const createStudent = async (student: CreateStudentDTO) => {
  console.log("📤 Enviando aluno ao backend:", student);
  const response = await apiSpring.post("/student", student);
  return response.data;
};

// Atualizar aluno
export const updateStudent = async (id: string, student: any) => {
  const response = await apiSpring.put(`/student/${id}`, student);
  return response.data;
};

//  Excluir aluno
export const deleteStudent = async (id: string) => {
  const response = await apiSpring.delete(`/student/${id}`);
  return response.data;
};
