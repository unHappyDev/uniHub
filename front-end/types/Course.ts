export interface Subject {
  subjectId: string;
  subjectName: string;
  workloadHours: number;
}

export interface Course {
  id: string;
  courseName: string;
  subjects?: Subject[];
  studentCount?: number;
}

export interface CreateCourseDTO {
  courseName: string;
}
