import apiSpring from "./clientSpring";
import { Classroom, CreateClassroomDTO } from "@/types/Classroom";

// Buscar todas as turmas
export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiSpring.get("/classroom");
  return response.data;
};

//  Criar nova turma
export const createClassroom = async (
  dto: CreateClassroomDTO,
): Promise<void> => {
  await apiSpring.post("/classroom", dto);
};

//  Atualizar turma existente
export const updateClassroom = async (
  id: string,
  dto: CreateClassroomDTO,
): Promise<void> => {
  await apiSpring.put(`/classroom/${id}`, dto);
};

// Adicionar alunos à turma
export const addStudentsToClassroom = async (
  id: string,
  studentIds: string[],
): Promise<void> => {
  await apiSpring.put(`/classroom/addStudents/${id}`, studentIds);
};

// Remover alunos da turma
export const removeStudentsFromClassroom = async (
  id: string,
  studentIds: string[],
): Promise<void> => {
  await apiSpring.delete(`/classroom/removeStudents/${id}`, {
    data: studentIds,
  });
};

//  Deletar turma
export const deleteClassroom = async (id: string): Promise<void> => {
  await apiSpring.delete(`/classroom/${id}`);
};
