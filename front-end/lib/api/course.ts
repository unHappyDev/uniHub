import apiSpring from "./clientSpring";
import { Course, CreateCourseDTO } from "@/types/Course";

// Buscar todos os cursos (com matérias)
export const getCourses = async (): Promise<Course[]> => {
  const response = await apiSpring.get("/course");
  return response.data;
};

// Buscar nomes dos cursos
export const getCourseNames = async (): Promise<Course[]> => {
  const response = await apiSpring.get("/course/names");
  return response.data;
};

// Criar curso
export const createCourse = async (course: CreateCourseDTO) => {
  const response = await apiSpring.post("/course", course);
  return response.data;
};

// Atualizar curso
export const updateCourse = async (id: string, course: CreateCourseDTO) => {
  const response = await apiSpring.put(`/course/${id}`, course);
  return response.data;
};

// Excluir curso
export const deleteCourse = async (id: string) => {
  const response = await apiSpring.delete(`/course/${id}`);
  return response.data;
};

// Adicionar matéria
export const addSubjectToCourse = async (courseId: string, subjectId: string) => {
  const response = await apiSpring.put(
    `/course/addSubject/${courseId}`,
    [subjectId],
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

// Remover matéria
export const removeSubjectFromCourse = async (courseId: string, subjectId: string) => {
  const response = await apiSpring.delete(`/course/deleteSubject/${courseId}`, {
    data: [subjectId],
  });
  return response.data;
};
