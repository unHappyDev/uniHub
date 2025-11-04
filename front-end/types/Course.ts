export interface Subject {
  subjectId: string;
  subjectName: string;
  workloadHours: number;
}

export interface Course {
  id: string;
  courseName: string;
  subjects?: Subject[];
}

export interface CreateCourseDTO {
  courseName: string;
}
