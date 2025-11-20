import apiSpring from "./clientSpring";
import { Classroom, CreateClassroomDTO } from "@/types/Classroom";

export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiSpring.get("/classroom");
  return response.data.map((c: any) => ({
    classroomId: c.classroomId,
    semester: c.semester,
    professor: c.professor, // é string
    subject: c.subject,
    schedules: c.schedules ?? [],
    students: c.students?.map((s: any) => ({
      name: s.name,
      courseName: s.courseName ?? "",
    })) ?? [],
  }));
};

export const getClassroomsByProfessor = async (professorName?: string): Promise<Classroom[]> => {
  const all = await getClassrooms();
  if (!professorName) return all;
  return all.filter(c => c.professor === professorName);
};

export const getClassroomsByStudent = async (studentName: string): Promise<Classroom[]> => {
  const all = await getClassrooms();
  return all.filter(c => c.students.some(s => s.name === studentName));
};

export const createClassroom = async (dto: CreateClassroomDTO): Promise<void> => {
  await apiSpring.post("/classroom", dto);
};

export const updateClassroom = async (id: string, dto: CreateClassroomDTO): Promise<void> => {
  await apiSpring.put(`/classroom/${id}`, dto);
};

export const addStudentsToClassroom = async (id: string, studentIds: string[]): Promise<void> => {
  await apiSpring.put(`/classroom/addStudents/${id}`, studentIds);
};

export const removeStudentsFromClassroom = async (id: string, studentIds: string[]): Promise<void> => {
  await apiSpring.delete(`/classroom/removeStudents/${id}`, { data: studentIds });
};

export const deleteClassroom = async (id: string): Promise<void> => {
  await apiSpring.delete(`/classroom/${id}`);
};
