export interface Grade {
  id: string;
  student: string;
  studentId: string;
  subject: string;
  activity: string;
  grade: number;
}

export interface CreateGradeDTO {
  studentId: string;
  classroomId: string;
  activity: string;
  grade: number;
}
