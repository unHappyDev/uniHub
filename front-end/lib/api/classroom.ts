import apiSpring from "./clientSpring";
import { Classroom, CreateClassroomDTO } from "@/types/Classroom";

export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiSpring.get("/classroom");
  return response.data;
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
  await apiSpring.delete(`/classroom/removeStudents/${id}`, {
    data: studentIds,
  });
};

export const deleteClassroom = async (id: string): Promise<void> => {
  await apiSpring.delete(`/classroom/${id}`);
};
