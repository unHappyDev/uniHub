export type Activity = "prova" | "trabalho" | "recuperacao" | "extra";

export interface Grade {
  id: string;
  classroomId: string;
  studentId: string;
  student: string;
  subject?: string;
  activity: Activity;
  grade: number;
  bimester: number;
}

export interface CreateGradeDTO {
  studentId: string;
  subject: string;
  classroomId: string;
  activity: Activity;
  grade: number;
  bimester: number;
}
