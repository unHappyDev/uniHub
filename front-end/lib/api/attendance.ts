import apiSpring from "./clientSpring";
import { Attendance, CreateAttendanceDTO } from "@/types/Attendance";

// ✅ GET
export const getAttendances = async (): Promise<Attendance[]> => {
  const response = await apiSpring.get("/attendance");
  return response.data;
};

// ✅ POST
export const createAttendance = async (data: CreateAttendanceDTO) => {
  await apiSpring.post("/attendance", data);
};

// ✅ PUT
export const updateAttendance = async (id: string, data: CreateAttendanceDTO) => {
  await apiSpring.put(`/attendance/${id}`, data);
};

// ✅ DELETE
export const deleteAttendance = async (id: string) => {
  await apiSpring.delete(`/attendance/${id}`);
};
