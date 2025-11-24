import { Classroom } from "@/types/Classroom";
import { getClassroomsByLoggedProfessor } from "./classroom";
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

// ======================================================
// PEGAR HORÁRIOS DO PROFESSOR — COM LOGS FULL DEBUG
// ======================================================

export const getHorariosDoProfessor = async (professorId: string): Promise<HorarioDTO[]> => {

  console.log("===============================================");
  console.log("🔎 INICIANDO BUSCA DE HORÁRIOS DO PROFESSOR");
  console.log("🧑‍🏫 Professor ID recebido:", professorId);
  console.log("===============================================");

  // 1. Buscar todas as turmas
  const allClassrooms: Classroom[] = await getClassroomsByLoggedProfessor();

  // console.log("📌 TOTAL DE TURMAS ENCONTRADAS NO SISTEMA:", allClassrooms.length);
  // console.log("📚 EXEMPLO DE TURMA BRUTA:", allClassrooms[0]);

  // console.log(professorId)

  // // 2. Filtrar turmas do professor
  // const professorClassrooms: Classroom[] = allClassrooms.filter(
  //   (c) => c.professorId === professorId
  // );

  // console.log("--------------------------------------------------");
  // console.log("🧑‍🏫 TURMAS DO PROFESSOR:", professorClassrooms.length);
  // professorClassrooms.forEach((c) => {
  //   console.log("📘 Turma encontrada:", {
  //     classroomId: c.classroomId,
  //     semester: c.semester,
  //     subject: c.subject,
  //     professorName: c.professor,
  //     schedules: c.schedules.length,
  //   });
  // });
  // console.log("--------------------------------------------------");

  const horariosDoProfessor: HorarioDTO[] = [];

  // 3. Coletar horários reais
  for (const classroom of allClassrooms) {
    console.log(`\n🕒 PROCESSANDO TURMA: ${classroom.classroomId} - ${classroom.subject}`);

    if (!classroom.schedules || classroom.schedules.length === 0) {
      console.log("⚠️ Turma não possui horários cadastrados!");
      continue;
    }

    classroom.schedules.forEach((schedule) => {
      console.log("➡️ Horário bruto recebido:", schedule);

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

  console.log("===============================================");
  console.log("📊 TOTAL FINAL DE HORÁRIOS MAPEADOS:", horariosDoProfessor.length);
  console.log("📌 LISTA FINAL ENVIADA PARA TABELA:");
  horariosDoProfessor.forEach((h) =>
    console.log({
      hora: h.startAt,
      dia: h.dayOfWeek,
      materia: h.subjectName,
      turma: h.classroomId,
    })
  );
  console.log("===============================================");

  return horariosDoProfessor;
};


export const getHorariosDoEstudante = async (studentId: string): Promise<HorarioDTO[]> => {

  console.log("===============================================");
  console.log("🔎 INICIANDO BUSCA DE HORÁRIOS DO ESTUDANTE");
  console.log("👨‍🎓 Student ID recebido:", studentId);
  console.log("===============================================");

  // 1. Buscar todas as turmas do estudante
  const response = await apiSpring.get(`/students/${studentId}/classrooms`);
  const allClassrooms: Classroom[] = response.data;

  console.log("📌 TOTAL DE TURMAS ENCONTRADAS:", allClassrooms.length);

  const horariosDoEstudante: HorarioDTO[] = [];

  // 2. Coletar horários de cada turma
  for (const classroom of allClassrooms) {
    console.log(`\n🕒 PROCESSANDO TURMA: ${classroom.classroomId} - ${classroom.subject}`);

    if (!classroom.schedules || classroom.schedules.length === 0) {
      console.log("⚠️ Turma não possui horários cadastrados!");
      continue;
    }

    classroom.schedules.forEach((schedule) => {
      console.log("➡️ Horário bruto recebido:", schedule);

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

  console.log("===============================================");
  console.log("📊 TOTAL FINAL DE HORÁRIOS MAPEADOS:", horariosDoEstudante.length);
  console.log("📌 LISTA FINAL ENVIADA PARA TABELA:");
  horariosDoEstudante.forEach((h) =>
    console.log({
      hora: h.startAt,
      dia: h.dayOfWeek,
      materia: h.subjectName,
      turma: h.classroomId,
    })
  );
  console.log("===============================================");

  return horariosDoEstudante;
};