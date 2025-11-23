import apiSpring from "./clientSpring";
import { getClassrooms } from "./classroom";

export interface HorarioDTO {
  scheduleId: string;
  classroomId: string;
  subjectName: string;
  professorName: string;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

export const getHorarios = async (classroomId: string): Promise<HorarioDTO[]> => {
  const classrooms = await getClassrooms();
  const classroom = classrooms.find(c => c.classroomId === classroomId);

  if (!classroom) return [];

  const response = await apiSpring.get(`/schedules?classroomId=${classroomId}`);
  const schedules = response.data ?? [];

  return schedules.map((s: any) => ({
    scheduleId: s.scheduleId,
    classroomId: classroom.classroomId,
    subjectName: classroom.subject,
    professorName: classroom.professor,
    dayOfWeek: s.dayOfWeek,
    startAt: s.startAt,
    endAt: s.endAt,
  }));
};
