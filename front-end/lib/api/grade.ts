import apiSpring from "./clientSpring";
import { Grade, CreateGradeDTO } from "@/types/Grade";

export interface NotaDTO {
  gradeId: string;
  studentId: string;
  studentName: string;
  classroomId: string;
  subject: string;
  activity: string;
  grade: number | null;
  bimester: number;
}

export const getGrades = async (): Promise<Grade[]> => {
  const response = await apiSpring.get("/grade");
  console.log("Resposta da API /grade:", response);
  const mapped = response.data.map((g: any) => ({
    id: g.id,
    studentId: g.student?.id ?? g.studentId,
    classroomId: g.classroom?.classroomId ?? g.classroomId,
    activity: g.activity,
    grade: g.grade,
  }));
  console.log("Notas mapeadas:", mapped);
  return mapped;
};

export const getGradesByClassroom = async (classroomId: string) => {
  const response = await apiSpring.get(`/grade/${classroomId}`);
  return response.data;
};

export const getNotasDoEstudante = async (): Promise<NotaDTO[]> => {
  try {
    const response = await apiSpring.get("/grade/student");
    console.log("Resposta da API /grade/student:", response);  
    console.log("Data retornada da API:", response.data);     
    return response.data ?? [];
  } catch (err) {
    console.error("Erro ao buscar notas do estudante:", err);
    throw err;
  }
};
export const createGrade = async (data: {
  studentId: string;
  classroomId: string;
  activity: string;
  grade: number;
}) => {
  const response = await apiSpring.post("/grade", data);
  return response.data;
};

export const updateGrade = async (
  id: string,
  data: {
    studentId: string;
    classroomId: string;
    activity: string;
    grade: number;
  },
) => {
  const response = await apiSpring.put(`/grade/${id}`, data);
  return response.data;
};

export const deleteGrade = async (id: string) => {
  return apiSpring.delete(`/grade/${id}`);
};
