import apiSpring from "./clientSpring";
import { Attendance, CreateAttendanceDTO } from "@/types/Attendance";

export const getAttendances = async (): Promise<Attendance[]> => {
  const response = await apiSpring.get("/attendance");

  return (response.data ?? []).map((a: any) => ({
    id: a.id ?? a.attendanceId ?? a.attendanceId,
    studentId: a.studentId,
    username: a.username,
    subjectName: a.subjectName,
    attendanceDate: a.attendanceDate,
    presence: a.presence,
    schedule: a.schedule
      ? {
          scheduleId: a.schedule.scheduleId,
          dayOfWeek: a.schedule.dayOfWeek,
          startAt: a.schedule.startAt,
          endAt: a.schedule.endAt,
        }
      : null,
  }));
};

export const createAttendance = async (data: CreateAttendanceDTO) => {
 
  await apiSpring.post("/attendance", {
    ...data,
    attendanceDate: data.attendanceDate,
  });
};

export const updateAttendance = async (id: string, data: CreateAttendanceDTO) => {
  await apiSpring.put(`/attendance/${id}`, data);
};

export const deleteAttendance = async (id: string) => {
  await apiSpring.delete(`/attendance/${id}`);
};
