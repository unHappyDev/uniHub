import apiSpring from "./clientSpring";
import {
  Classroom,
  CreateClassroomDTO,
  ClassroomSchedule,
  ClassroomStudent,
} from "@/types/Classroom";

export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiSpring.get("/classroom");

  return (response.data ?? []).map(
    (c: any): Classroom => ({
      classroomId: c.classroomId,
      semester: c.semester,
      professor: c.professor,
      subject: c.subject,
      schedules: (c.schedules ?? []).map(
        (s: any): ClassroomSchedule => ({
          scheduleId: s.scheduleId,
          dayOfWeek: s.dayOfWeek,
          startAt: s.startAt,
          endAt: s.endAt,
        }),
      ),
      students: (c.students ?? []).map(
        (s: any): ClassroomStudent => ({
          id: s.studentId ?? s.id ?? s.id,
          name: s.username ?? s.name ?? s.user?.username ?? "",
          courseName: s.courseName ?? "",
        }),
      ),
    }),
  );
};

export const getClassroomById = async (
  id: string,
): Promise<Classroom | undefined> => {
  const all = await getClassrooms();
  return all.find((c) => c.classroomId === id);
};

export const getClassroomsByProfessor = async (
  professorName?: string,
): Promise<Classroom[]> => {
  const all = await getClassrooms();
  return !professorName
    ? all
    : all.filter((c) => c.professor === professorName);
};

export const getClassroomsByStudent = async (
  studentName: string,
): Promise<Classroom[]> => {
  const all = await getClassrooms();
  return all.filter((c) => c.students.some((s) => s.name === studentName));
};

export const createClassroom = async (
  dto: CreateClassroomDTO,
): Promise<void> => {
  await apiSpring.post("/classroom", dto);
};

export const updateClassroom = async (
  id: string,
  dto: CreateClassroomDTO,
): Promise<void> => {
  await apiSpring.put(`/classroom/${id}`, dto);
};

export const addStudentsToClassroom = async (
  id: string,
  studentIds: string[],
): Promise<void> => {
  await apiSpring.put(`/classroom/addStudents/${id}`, studentIds);
};

export const removeStudentsFromClassroom = async (
  id: string,
  studentIds: string[],
): Promise<void> => {
  await apiSpring.delete(`/classroom/removeStudents/${id}`, {
    data: studentIds,
  });
};

export const deleteClassroom = async (id: string): Promise<void> => {
  await apiSpring.delete(`/classroom/${id}`);
};
