export interface ClassroomSchedule {
  scheduleId?: string | null;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

export interface ClassroomStudent {
  name: string;
  courseName: string;
}

export interface Classroom {
  classroomId: string;
  professor: string;
  subject: string;
  semester: string;
  schedules: ClassroomSchedule[];
  students: ClassroomStudent[];
}

export interface CreateClassroomDTO {
  professorId: string;
  subjectId: string;
  semester: string;
  schedules: ClassroomSchedule[];
  studentsIds: string[];
}
