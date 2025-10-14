import { apiSpring } from "./client";

export const getStudents = async () => {
  const response = await apiSpring.get("/student");
  return response.data;
};

export const createStudent = async (student: any) => {
  const response = await apiSpring.post("/student", student);
  return response.data;
};

export const updateStudent = async (id: number, student: any) => {
  const response = await apiSpring.put(`/student/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  const response = await apiSpring.delete(`/student/${id}`);
  return response.data;
};
