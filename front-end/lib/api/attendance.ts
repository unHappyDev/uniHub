import apiSpring from "./clientSpring";
import {
  Attendance,
  CreateAttendanceDTO,
  StudentsAttendanceDTO,
} from "@/types/Attendance";

const normalizeAttendance = (a: any): Attendance => ({
  id: a.id,
  studentId: a.studentId,
  username: a.username,
  classroomId: a.classroomId,
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
});

export const getStudentsAbsences = async (): Promise<
  StudentsAttendanceDTO[]
> => {
  const url = `/attendance/number`;
  try {
    const response = await apiSpring.get(url);
    return response.data as StudentsAttendanceDTO[];
  } catch (error: any) {
    return [];
  }
};

export const getAttendancesByClassroom = async (
  classroomId: string,
): Promise<Attendance[]> => {
  const url = `/attendance/${classroomId}`;

  try {
    const response = await apiSpring.get(url);
    return response.data.map((x: any) => normalizeAttendance(x));
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getAttendanceByStudent = async (
  studentId: string,
): Promise<Attendance[]> => {
  const url = `/attendance/student/${studentId}`;

  try {
    const response = await apiSpring.get(url);
    return response.data.map((x: any) => normalizeAttendance(x));
  } catch (error: any) {
    throw error;
  }
};

export const createAttendance = async (data: CreateAttendanceDTO) => {
  try {
    const response = await apiSpring.post("/attendance", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateAttendance = async (
  id: string,
  data: Partial<CreateAttendanceDTO>,
) => {
  try {
    const response = await apiSpring.put(`/attendance/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteAttendance = async (id: string) => {
  try {
    await apiSpring.delete(`/attendance/${id}`);
    return true;
  } catch (error: any) {
    throw error;
  }
};
