export interface Subject {
  subjectId: string;
  subjectName: string;
  workloadHours: number;
}

export interface CreateSubjectDTO {
  subjectName: string;
  workloadHours: number;
}
