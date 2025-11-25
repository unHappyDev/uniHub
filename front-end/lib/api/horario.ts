import { Classroom } from "@/types/Classroom";
import {
  getClassroomsByLoggedProfessor,
  getClassroomsByLoggedStudent,
} from "./classroom";
import apiSpring from "./clientSpring";

export interface HorarioDTO {
  scheduleId: string;
  classroomId: string;
  subjectName: string;
  semester?: string;
  professorName: string;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

export const getHorariosDoProfessor = async (
  professorId: string,
): Promise<HorarioDTO[]> => {
  console.log(" Professor ID recebido:", professorId);

  const allClassrooms: Classroom[] = await getClassroomsByLoggedProfessor();

  const horariosDoProfessor: HorarioDTO[] = [];

  for (const classroom of allClassrooms) {
    if (!classroom.schedules || classroom.schedules.length === 0) {
      continue;
    }

    classroom.schedules.forEach((schedule) => {
      horariosDoProfessor.push({
        scheduleId: schedule.scheduleId ?? "N/A",
        classroomId: classroom.classroomId,
        subjectName: classroom.subject,
        professorName: classroom.professor,
        semester: classroom.semester,
        dayOfWeek: schedule.dayOfWeek,
        startAt: schedule.startAt,
        endAt: schedule.endAt,
      });
    });
  }

  horariosDoProfessor.forEach((h) =>
    console.log({
      hora: h.startAt,
      dia: h.dayOfWeek,
      materia: h.subjectName,
      turma: h.classroomId,
    }),
  );

  return horariosDoProfessor;
};

export const getHorariosDoEstudante = async (): Promise<HorarioDTO[]> => {
  const allClassrooms: Classroom[] = await getClassroomsByLoggedStudent();

  if (allClassrooms.length > 0) {
  }

  const horariosDoEstudante: HorarioDTO[] = [];

  for (const classroom of allClassrooms) {
    if (!classroom.schedules || classroom.schedules.length === 0) {
      continue;
    }

    classroom.schedules.forEach((schedule) => {
      console.log(" Horário recebido:", schedule);

      horariosDoEstudante.push({
        scheduleId: schedule.scheduleId ?? "N/A",
        classroomId: classroom.classroomId,
        subjectName: classroom.subject,
        professorName: classroom.professor,
        semester: classroom.semester,
        dayOfWeek: schedule.dayOfWeek,
        startAt: schedule.startAt,
        endAt: schedule.endAt,
      });
    });
  }

  horariosDoEstudante.forEach((h) =>
    console.log({
      hora: h.startAt,
      dia: h.dayOfWeek,
      materia: h.subjectName,
      turma: h.classroomId,
    }),
  );

  return horariosDoEstudante;
};
