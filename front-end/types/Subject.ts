// Tipo usado no front-end
export interface Subject {
  id: string; 
  subjectName: string;
  workloadHours: number;
}

// Tipo para criar uma nova matéria (DTO do backend)
export interface CreateSubjectDTO {
  subjectName: string;
  workloadHours: number;
}
