export interface ClassroomStudent {
  name: string;
  courseName: string;
}

export interface Classroom {
  classroomId: string;
  professor: string;
  subject: string;
  semester: string;
  startAt: string;
  endAt: string;
  students: ClassroomStudent[];
}

export interface CreateClassroomDTO {
  professorId: string;
  subjectId: string;
  semester: string;
  startAt: string;
  endAt: string;
  studentsIds: string[];
}
