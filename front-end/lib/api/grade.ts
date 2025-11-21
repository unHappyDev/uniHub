import apiSpring from "./clientSpring";
import { Grade, CreateGradeDTO } from "@/types/Grade";

export const getGrades = async (): Promise<Grade[]> => {
  const response = await apiSpring.get("/grade");

  const mapped = response.data.map((g: any) => ({
    id: g.id,
    studentId: g.student?.id ?? g.studentId, // garante compatibilidade
    classroomId: g.classroom?.classroomId ?? g.classroomId,
    activity: g.activity,
    grade: g.grade,
  }));

  console.log("GRADES MAPEADAS:", mapped);

  return mapped;
};
// Filtra as notas de uma turma específica
export const getGradesByClassroom = async (classroomId: string): Promise<Grade[]> => {
  console.log("📌 Buscando notas da turma:", classroomId);

  const response = await apiSpring.get(`/grade/${classroomId}`);
  const mapped = response.data.map((g: any) => {
    const grade = {
      id: g.id,
      studentId: g.student?.id ?? g.studentId,
      classroomId: g.classroom?.classroomId ?? g.classroomId,
      activity: g.activity,
      grade: g.grade,
    };

    console.log("🧩 Nota mapeada:", grade);
    return grade;
  });

  console.log("📤 Notas retornadas Ao Front:", mapped);
  return mapped;
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
  }
) => {
  const response = await apiSpring.put(`/grade/${id}`, data);
  return response.data;
};

export const deleteGrade = async (id: string) => {
  return apiSpring.delete(`/grade/${id}`);
};