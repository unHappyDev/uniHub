export interface Grade {
  id: string;
  student: string;
  subject: string;
  grade: number;
}

export interface CreateGradeDTO {
  studentId: string;
  classroomId: string;
  activity: string;
  grade: number;
}
