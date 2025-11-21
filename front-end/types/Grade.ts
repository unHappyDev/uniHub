// types/Grade.ts
export type Activity = "prova" | "trabalho" | "recuperacao" | "extra";

export interface Grade {
  id: string;
  classroomId: string;
  studentId: string;
  student: string; // nome do aluno
  subject?: string;
  activity: Activity;
  grade: number;
}

export interface CreateGradeDTO {
  studentId: string;
  subject: string;
  classroomId: string;
  activity: Activity; // <-- REMOVIDO o string
  grade: number;
}
