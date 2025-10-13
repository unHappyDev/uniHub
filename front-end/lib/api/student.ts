import apiClient from "./client";

export const getStudents = async () => {
  const response = await apiClient.get("/student");
  return response.data;
};

export const createStudent = async (student: any) => {
  const response = await apiClient.post("/student", student);
  return response.data;
};

export const updateStudent = async (id: number, student: any) => {
  const response = await apiClient.put(`/student/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  const response = await apiClient.delete(`/student/${id}`);
  return response.data;
};